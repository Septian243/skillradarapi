const Boom = require('@hapi/boom');
const User = require('../models/User');
const Course = require('../models/Course');
const UserCourse = require('../models/UserCourse');
const LearningPath = require('../models/LearningPath');
const SkillSnapshot = require('../models/SkillSnapshot');
const CourseSkill = require('../models/CourseSkill');
const Skill = require('../models/Skill');
const CalculationUtils = require('../utils/calculations');

class UserCoursesHandler {
    // GET /users/:userId/courses
    static async getUserCourses(request, h) {
        try {
            const { userId } = request.params;
            const { tab } = request.query;

            const user = await User.findOne({ user_id: userId }).lean();
            if (!user) {
                throw Boom.notFound('User tidak ditemukan');
            }

            if (tab === 'completed') {
                return await UserCoursesHandler.getCompletedCourses(userId);
            }

            return await UserCoursesHandler.getActiveCourses(user);
        } catch (error) {
            if (Boom.isBoom(error)) throw error;
            throw Boom.badImplementation(error.message);
        }
    }

    // GET courses dari active learning path
    static async getActiveCourses(user) {
        const [learningPath, courses, userCourses] = await Promise.all([
            LearningPath.findOne({
                learning_path_id: user.active_learning_path_id
            }).lean(),
            Course.find({
                learning_path_id: user.active_learning_path_id
            }).sort({ course_id: 1 }).lean(),
            UserCourse.find({
                user_id: user.user_id,
                course_id: { $in: [] }
            }).lean()
        ]);

        const courseIds = courses.map(c => c.course_id);
        const allUserCourses = await UserCourse.find({
            user_id: user.user_id,
            course_id: { $in: courseIds }
        }).lean();

        const userCourseMap = new Map();
        allUserCourses.forEach(uc => {
            userCourseMap.set(uc.course_id, uc);
        });

        const coursesData = courses.map(course => {
            const userCourse = userCourseMap.get(course.course_id);
            return {
                id: course.course_id,
                name: course.course_name,
                status: userCourse?.status || 'in_progress',
                progress: userCourse?.progress_percentage || 0
            };
        });

        return {
            error: false,
            message: 'success',
            data: {
                learning_path: learningPath.learning_path_name,
                courses: coursesData
            }
        };
    }

    // GET completed courses dari semua learning path
    static async getCompletedCourses(userId) {
        const completedUserCourses = await UserCourse.find({
            user_id: userId,
            status: 'completed'
        }).sort({ tanggal_selesai: -1 }).lean();

        const courseIds = completedUserCourses.map(uc => uc.course_id);

        const [courses, learningPaths] = await Promise.all([
            Course.find({ course_id: { $in: courseIds } }).lean(),
            (async () => {
                const tempCourses = await Course.find({ course_id: { $in: courseIds } }).lean();
                const learningPathIds = [...new Set(tempCourses.map(c => c.learning_path_id))];
                return LearningPath.find({
                    learning_path_id: { $in: learningPathIds }
                }).lean();
            })()
        ]);

        const completedCoursesMap = new Map();
        completedUserCourses.forEach(uc => {
            completedCoursesMap.set(uc.course_id, uc);
        });

        const groupedData = learningPaths.map(lp => {
            const lpCourses = courses
                .filter(c => c.learning_path_id === lp.learning_path_id)
                .map(course => {
                    const userCourse = completedCoursesMap.get(course.course_id);
                    return {
                        id: course.course_id,
                        name: course.course_name,
                        completed_at: userCourse.tanggal_selesai.toISOString().split('T')[0]
                    };
                })
                .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

            return {
                learning_path: lp.learning_path_name,
                courses: lpCourses
            };
        }).filter(lp => lp.courses.length > 0);

        return {
            error: false,
            message: 'success',
            data: groupedData
        };
    }

    // GET /users/:userId/courses/:courseId
    static async getCourseDetail(request, h) {
        try {
            const { userId, courseId } = request.params;

            const [course, userCourse] = await Promise.all([
                Course.findOne({ course_id: courseId }).lean(),
                UserCourse.findOne({
                    user_id: userId,
                    course_id: courseId
                }).lean()
            ]);

            if (!course) {
                throw Boom.notFound('Course tidak ditemukan');
            }

            if (!userCourse) {
                throw Boom.notFound('User belum terdaftar di course ini');
            }

            const learningPath = await LearningPath.findOne({
                learning_path_id: course.learning_path_id
            }).lean();

            const data = {
                id: course.course_id,
                name: course.course_name,
                learning_path: learningPath.learning_path_name,
                status: userCourse.status,
                progress: userCourse.progress_percentage,
                can_complete: userCourse.status === 'in_progress' && userCourse.progress_percentage === 100
            };

            if (userCourse.status === 'completed') {
                data.nilai_ujian = userCourse.nilai_ujian_akhir;
                data.nilai_submission = userCourse.nilai_submission;
                data.completed_at = userCourse.tanggal_selesai.toISOString();
                data.can_complete = false;
            }

            return {
                error: false,
                message: 'success',
                data
            };
        } catch (error) {
            if (Boom.isBoom(error)) throw error;
            throw Boom.badImplementation(error.message);
        }
    }

    // POST /users/:userId/courses/:courseId/complete
    static async completeCourse(request, h) {
        try {
            const { userId, courseId } = request.params;

            const userCourse = await UserCourse.findOne({
                user_id: userId,
                course_id: courseId
            });

            if (!userCourse) {
                throw Boom.notFound('User course tidak ditemukan');
            }

            if (userCourse.status === 'completed') {
                throw Boom.badRequest('Course sudah diselesaikan');
            }

            const courseScore = CalculationUtils.calculateCourseScore(
                userCourse.nilai_ujian_akhir,
                userCourse.nilai_submission
            );

            userCourse.status = 'completed';
            userCourse.progress_percentage = 100;
            userCourse.course_score = courseScore;
            userCourse.tanggal_selesai = new Date();

            const course = await Course.findOne({ course_id: courseId }).lean();

            await Promise.all([
                userCourse.save(),
                UserCoursesHandler.saveSkillSnapshot(userId, course.learning_path_id)
            ]);

            return {
                error: false,
                message: 'Kelas berhasil diselesaikan!',
                data: {
                    course_id: courseId,
                    course_name: course.course_name,
                    nilai_ujian: userCourse.nilai_ujian_akhir,
                    nilai_submission: userCourse.nilai_submission,
                    status: 'completed',
                    completed_at: userCourse.tanggal_selesai.toISOString()
                }
            };
        } catch (error) {
            if (Boom.isBoom(error)) throw error;
            throw Boom.badImplementation(error.message);
        }
    }

    static async saveSkillSnapshot(userId, learningPathId) {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const [existingSnapshot, skills, completedUserCourses] = await Promise.all([
            SkillSnapshot.findOne({
                user_id: userId,
                learning_path_id: learningPathId,
                snapshot_date: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            }),
            Skill.find({ learning_path_id: learningPathId }).lean(),
            UserCourse.find({
                user_id: userId,
                status: 'completed'
            }).lean()
        ]);

        const skillIds = skills.map(s => s.skill_id);
        const courseSkills = await CourseSkill.find({ skill_id: { $in: skillIds } }).lean();

        const userCourseMap = new Map();
        completedUserCourses.forEach(uc => {
            if (uc.course_score) {
                userCourseMap.set(uc.course_id, uc.course_score);
            }
        });

        const courseSkillsBySkillId = new Map();
        courseSkills.forEach(cs => {
            if (!courseSkillsBySkillId.has(cs.skill_id)) {
                courseSkillsBySkillId.set(cs.skill_id, []);
            }
            courseSkillsBySkillId.get(cs.skill_id).push(cs);
        });

        const skillData = new Map();

        for (const skill of skills) {
            const relatedCourseSkills = courseSkillsBySkillId.get(skill.skill_id) || [];
            const courseScores = [];

            for (const cs of relatedCourseSkills) {
                const score = userCourseMap.get(cs.course_id);
                if (score) {
                    courseScores.push({
                        score: score,
                        bobot: cs.bobot
                    });
                }
            }

            const skillScore = CalculationUtils.calculateSkillScore(courseScores);
            skillData.set(skill.skill_name, skillScore);
        }

        const skillArray = Array.from(skillData.entries()).map(([name, score]) => ({ name, score }));
        const summary = CalculationUtils.calculateSummary(skillArray);

        if (existingSnapshot) {
            existingSnapshot.skill_data = skillData;
            existingSnapshot.strongest_skill = summary.strongest;
            existingSnapshot.weakest_skill = summary.weakest;
            existingSnapshot.average_score = summary.average;
            existingSnapshot.snapshot_date = new Date();
            await existingSnapshot.save();
        } else {
            const lastSnapshot = await SkillSnapshot.findOne().sort({ snapshot_id: -1 }).lean();
            const newSnapshotId = lastSnapshot ? lastSnapshot.snapshot_id + 1 : 1;

            const snapshot = new SkillSnapshot({
                snapshot_id: newSnapshotId,
                user_id: userId,
                learning_path_id: learningPathId,
                snapshot_date: new Date(),
                skill_data: skillData,
                strongest_skill: summary.strongest,
                weakest_skill: summary.weakest,
                average_score: summary.average
            });

            await snapshot.save();
        }
    }
}

module.exports = UserCoursesHandler;