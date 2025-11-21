const Boom = require('@hapi/boom');
const User = require('../models/User');
const LearningPath = require('../models/LearningPath');
const Skill = require('../models/Skill');
const CourseSkill = require('../models/CourseSkill');
const UserCourse = require('../models/UserCourse');
const SkillSnapshot = require('../models/SkillSnapshot');
const Course = require('../models/Course');
const CalculationUtils = require('../utils/calculations');

class SkillDashboardHandler {
    // GET /users/:userId/skill-dashboard
    static async getSkillDashboard(request, h) {
        try {
            const { userId } = request.params;
            let { learning_path_id, date } = request.query;

            if (learning_path_id) {
                learning_path_id = parseInt(learning_path_id, 10);
            }

            if (date === 'undefined' || date === '' || date === null) {
                date = undefined;
            }

            const user = await User.findOne({ user_id: userId }).lean();
            if (!user) {
                throw Boom.notFound('User tidak ditemukan');
            }

            const targetLpId = learning_path_id || user.active_learning_path_id;
            const isActiveLp = targetLpId === user.active_learning_path_id;

            let targetDate;
            if (date) {
                targetDate = new Date(date);
            } else if (isActiveLp) {
                targetDate = new Date();
            } else {
                const lastSnapshot = await SkillSnapshot.findOne({
                    user_id: userId,
                    learning_path_id: targetLpId
                }).sort({ snapshot_date: -1 }).lean();
                targetDate = lastSnapshot ? lastSnapshot.snapshot_date : new Date();
            }

            const [learningPath, dropdowns] = await Promise.all([
                LearningPath.findOne({ learning_path_id: targetLpId }).lean(),
                SkillDashboardHandler.getDropdowns(userId, targetLpId, isActiveLp)
            ]);

            let skills, summary, recommendations;

            const isToday = targetDate.toDateString() === new Date().toDateString();

            if ((isToday && isActiveLp) || (!date && isActiveLp)) {
                const skillData = await SkillDashboardHandler.calculateRealTimeSkills(userId, targetLpId);
                skills = skillData.skills;
                summary = skillData.summary;
                recommendations = await SkillDashboardHandler.getRecommendations(userId, targetLpId, skills);
            } else {
                const latestSnapshot = await SkillSnapshot.findOne({
                    user_id: userId,
                    learning_path_id: targetLpId
                }).sort({ snapshot_date: -1 }).lean();

                const isLatestSnapshotDate = latestSnapshot &&
                    latestSnapshot.snapshot_date.toISOString().split('T')[0] ===
                    targetDate.toISOString().split('T')[0];

                const startOfDay = new Date(targetDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(targetDate);
                endOfDay.setHours(23, 59, 59, 999);

                const snapshot = await SkillSnapshot.findOne({
                    user_id: userId,
                    learning_path_id: targetLpId,
                    snapshot_date: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }).lean();

                if (snapshot) {
                    if (snapshot.skill_data instanceof Map) {
                        skills = Array.from(snapshot.skill_data.entries()).map(([name, score]) => ({
                            name,
                            score
                        }));
                    } else {
                        skills = Object.entries(snapshot.skill_data).map(([name, score]) => ({
                            name,
                            score
                        }));
                    }

                    summary = {
                        strongest: snapshot.strongest_skill,
                        weakest: snapshot.weakest_skill,
                        average: snapshot.average_score
                    };

                    if (isActiveLp) {
                        recommendations = [];
                    } else {
                        if (isLatestSnapshotDate) {
                            recommendations = await SkillDashboardHandler.getRecommendations(userId, targetLpId, skills);
                        } else {
                            recommendations = [];
                        }
                    }
                } else {
                    const skillData = await SkillDashboardHandler.calculateRealTimeSkills(userId, targetLpId);
                    skills = skillData.skills;
                    summary = skillData.summary;

                    if (isActiveLp || !latestSnapshot) {
                        recommendations = await SkillDashboardHandler.getRecommendations(userId, targetLpId, skills);
                    } else {
                        recommendations = [];
                    }
                }
            }

            return {
                error: false,
                message: 'success',
                data: {
                    user: user.user_name,
                    learning_path: learningPath.learning_path_name,
                    is_active: isActiveLp,
                    date: targetDate.toISOString().split('T')[0],
                    dropdowns,
                    skills,
                    summary,
                    recommendations
                }
            };
        } catch (error) {
            if (Boom.isBoom(error)) throw error;
            throw Boom.badImplementation(error.message);
        }
    }

    static async getDropdowns(userId, currentLpId, isActiveLp) {
        const [user, userCourses, snapshots] = await Promise.all([
            User.findOne({ user_id: userId }).lean(),
            UserCourse.find({ user_id: userId }).lean(),
            SkillSnapshot.find({
                user_id: userId,
                learning_path_id: currentLpId
            }).sort({ snapshot_date: -1 }).limit(10).lean()
        ]);

        const courseIds = userCourses.map(uc => uc.course_id);
        const courses = await Course.find({ course_id: { $in: courseIds } }).lean();

        const lpIds = [...new Set(courses.map(c => c.learning_path_id))];
        const learningPaths = await LearningPath.find({ learning_path_id: { $in: lpIds } }).lean();

        const lpDropdown = learningPaths.map(lp => ({
            id: lp.learning_path_id,
            name: lp.learning_path_name,
            is_active: lp.learning_path_id === user.active_learning_path_id
        }));

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const dateDropdown = [];

        const isCurrentLpActive = currentLpId === user.active_learning_path_id;

        if (isCurrentLpActive) {
            dateDropdown.push({
                date: todayStr,
                label: 'Hari Ini'
            });
        }

        for (const snapshot of snapshots) {
            const snapshotDateStr = snapshot.snapshot_date.toISOString().split('T')[0];

            if (snapshotDateStr === todayStr) {
                continue;
            }

            dateDropdown.push({
                date: snapshotDateStr,
                label: new Date(snapshotDateStr).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            });
        }

        return {
            learning_paths: lpDropdown,
            dates: dateDropdown
        };
    }

    static async calculateRealTimeSkills(userId, learningPathId) {
        const [skills, courseSkills, userCourses] = await Promise.all([
            Skill.find({ learning_path_id: learningPathId }).sort({ display_order: 1 }).lean(),
            CourseSkill.find({}).lean(),
            UserCourse.find({
                user_id: userId,
                status: 'completed'
            }).lean()
        ]);

        const skillIds = skills.map(s => s.skill_id);

        const relevantCourseSkills = courseSkills.filter(cs => skillIds.includes(cs.skill_id));

        const userCourseMap = new Map();
        userCourses.forEach(uc => {
            if (uc.course_score) {
                userCourseMap.set(uc.course_id, uc.course_score);
            }
        });

        const courseSkillsBySkill = new Map();
        relevantCourseSkills.forEach(cs => {
            if (!courseSkillsBySkill.has(cs.skill_id)) {
                courseSkillsBySkill.set(cs.skill_id, []);
            }
            courseSkillsBySkill.get(cs.skill_id).push(cs);
        });

        const skillScores = skills.map(skill => {
            const relatedCourseSkills = courseSkillsBySkill.get(skill.skill_id) || [];
            const courseScores = [];

            relatedCourseSkills.forEach(cs => {
                const score = userCourseMap.get(cs.course_id);
                if (score) {
                    courseScores.push({
                        score: score,
                        bobot: cs.bobot
                    });
                }
            });

            const skillScore = CalculationUtils.calculateSkillScore(courseScores);
            return { name: skill.skill_name, score: skillScore };
        });

        const summary = CalculationUtils.calculateSummary(skillScores);

        return { skills: skillScores, summary };
    }

    static async getRecommendations(userId, learningPathId, skills) {
        const weakSkills = skills
            .filter(s => s.score < 3)
            .sort((a, b) => a.score - b.score);

        if (weakSkills.length === 0) {
            return [];
        }

        const skillNames = weakSkills.map(s => s.name);

        const [skillDocs, courseSkills, courses, userCourses] = await Promise.all([
            Skill.find({
                skill_name: { $in: skillNames },
                learning_path_id: learningPathId
            }).lean(),
            CourseSkill.find({}).sort({ bobot: -1 }).lean(),
            Course.find({}).lean(),
            UserCourse.find({ user_id: userId }).lean()
        ]);

        const skillMap = new Map();
        skillDocs.forEach(s => skillMap.set(s.skill_name, s));

        const courseMap = new Map();
        courses.forEach(c => courseMap.set(c.course_id, c));

        const userCourseMap = new Map();
        userCourses.forEach(uc => userCourseMap.set(uc.course_id, uc));

        const skillIds = skillDocs.map(s => s.skill_id);
        const relevantCourseSkills = courseSkills.filter(cs => skillIds.includes(cs.skill_id));

        const courseSkillsBySkillId = new Map();
        relevantCourseSkills.forEach(cs => {
            if (!courseSkillsBySkillId.has(cs.skill_id)) {
                courseSkillsBySkillId.set(cs.skill_id, []);
            }
            courseSkillsBySkillId.get(cs.skill_id).push(cs);
        });

        const recommendations = [];

        for (const weakSkill of weakSkills) {
            const skill = skillMap.get(weakSkill.name);

            if (!skill) {
                console.warn(`Skill "${weakSkill.name}" not found in learning path ${learningPathId}`);
                continue;
            }

            const relatedCourseSkills = courseSkillsBySkillId.get(skill.skill_id) || [];

            if (relatedCourseSkills.length === 0) {
                console.warn(`No courses found for skill "${weakSkill.name}"`);
                continue;
            }

            let inProgressCount = 0;
            let notStartedCount = 0;
            let completedLowScoreCount = 0;
            let highestBobot = 0;

            const recommendedCourses = relatedCourseSkills.map(cs => {
                const course = courseMap.get(cs.course_id);
                const userCourse = userCourseMap.get(cs.course_id);

                let status = 'not_started';
                let courseScore = null;
                let priority = 'low';
                let action = '';

                if (userCourse) {
                    status = userCourse.status;
                    courseScore = userCourse.course_score;
                }

                const bobot = cs.bobot;
                if (bobot > highestBobot) highestBobot = bobot;

                if (status === 'not_started') {
                    notStartedCount++;
                    if (bobot >= 50) {
                        priority = 'high';
                        action = 'Prioritas tinggi - Segera kerjakan kelas ini';
                    } else if (bobot >= 30) {
                        priority = 'medium';
                        action = 'Kerjakan setelah kelas prioritas tinggi selesai';
                    } else {
                        priority = 'low';
                        action = 'Kerjakan jika ada waktu';
                    }
                } else if (status === 'in_progress') {
                    inProgressCount++;
                    if (bobot >= 40) {
                        priority = 'high';
                        action = 'Prioritas tinggi - Selesaikan kelas ini segera';
                    } else {
                        priority = 'medium';
                        action = 'Lanjutkan dan selesaikan kelas ini';
                    }
                } else if (status === 'completed') {
                    const gap = 5 - (courseScore || 0);
                    const impactScore = (bobot / 100) * gap;

                    if (impactScore >= 1.0) {
                        completedLowScoreCount++;
                        priority = 'medium';
                        action = `Ulangi untuk meningkatkan nilai dari ${courseScore?.toFixed(2) || 0}`;
                    } else {
                        priority = 'low';
                        action = 'Nilai sudah baik, fokus ke kelas lain';
                    }
                }

                return {
                    id: course.course_id,
                    name: course.course_name,
                    status: status,
                    course_score: courseScore,
                    bobot_kontribusi: bobot,
                    priority: priority,
                    action: action
                };
            });

            const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
            recommendedCourses.sort((a, b) => {
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (priorityDiff !== 0) return priorityDiff;
                return b.bobot_kontribusi - a.bobot_kontribusi;
            });

            let recommendationSummary = '';
            if (inProgressCount > 0) {
                recommendationSummary = `Selesaikan ${inProgressCount} kelas yang sedang berjalan terlebih dahulu.`;
            } else if (notStartedCount > 0) {
                recommendationSummary = `Mulai dengan kelas yang memiliki bobot kontribusi tertinggi.`;
            } else if (completedLowScoreCount > 0) {
                recommendationSummary = `Ulangi ${completedLowScoreCount} kelas dengan nilai rendah untuk meningkatkan skor skill.`;
            } else {
                recommendationSummary = `Semua kelas sudah diselesaikan dengan baik. Pertimbangkan kelas lanjutan.`;
            }

            recommendations.push({
                skill: weakSkill.name,
                current_score: parseFloat(weakSkill.score.toFixed(2)),
                target_score: 3.0,
                recommendation_summary: recommendationSummary,
                courses: recommendedCourses
            });
        }

        return recommendations;
    }
}

module.exports = SkillDashboardHandler;