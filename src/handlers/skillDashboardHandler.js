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
            const { learning_path_id, date } = request.query;

            const user = await User.findOne({ user_id: userId });
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
                }).sort({ snapshot_date: -1 });
                targetDate = lastSnapshot ? lastSnapshot.snapshot_date : new Date();
            }

            const learningPath = await LearningPath.findOne({ learning_path_id: targetLpId });
            const dropdowns = await SkillDashboardHandler.getDropdowns(userId, targetLpId, isActiveLp);

            let skills, summary, recommendations;

            const isToday = targetDate.toDateString() === new Date().toDateString();
            if (isToday && isActiveLp) {
                const skillData = await SkillDashboardHandler.calculateRealTimeSkills(userId, targetLpId);
                skills = skillData.skills;
                summary = skillData.summary;
                recommendations = await SkillDashboardHandler.getRecommendations(userId, targetLpId, skills);
            } else {
                const snapshot = await SkillSnapshot.findOne({
                    user_id: userId,
                    learning_path_id: targetLpId,
                    snapshot_date: {
                        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                        $lt: new Date(targetDate.setHours(23, 59, 59, 999))
                    }
                });

                if (snapshot) {
                    skills = Array.from(snapshot.skill_data.entries()).map(([name, score]) => ({
                        name,
                        score
                    }));
                    summary = {
                        strongest: snapshot.strongest_skill,
                        weakest: snapshot.weakest_skill,
                        average: snapshot.average_score
                    };
                    recommendations = await SkillDashboardHandler.getRecommendations(userId, targetLpId, skills);
                } else {
                    skills = [];
                    summary = { strongest: null, weakest: null, average: 0 };
                    recommendations = [];
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
        const userCourses = await UserCourse.find({ user_id: userId });
        const courseIds = userCourses.map(uc => uc.course_id);
        const courses = await Course.find({ course_id: { $in: courseIds } });

        const lpIds = [...new Set(courses.map(c => c.learning_path_id))];
        const learningPaths = await LearningPath.find({ learning_path_id: { $in: lpIds } });

        const lpDropdown = learningPaths.map(lp => ({
            id: lp.learning_path_id,
            name: lp.learning_path_name,
            is_active: lp.learning_path_id === currentLpId
        }));

        const snapshots = await SkillSnapshot.find({
            user_id: userId,
            learning_path_id: currentLpId
        }).sort({ snapshot_date: -1 }).limit(10);

        const today = new Date().toISOString().split('T')[0];
        const dateDropdown = snapshots.map(s => {
            const dateStr = s.snapshot_date.toISOString().split('T')[0];
            return {
                date: dateStr,
                label: dateStr === today ? 'Hari Ini' : new Date(dateStr).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            };
        });

        if (isActiveLp && !dateDropdown.some(d => d.date === today)) {
            dateDropdown.unshift({ date: today, label: 'Hari Ini' });
        }

        return {
            learning_paths: lpDropdown,
            dates: dateDropdown
        };
    }

    static async calculateRealTimeSkills(userId, learningPathId) {
        const skills = await Skill.find({ learning_path_id: learningPathId })
            .sort({ display_order: 1 });

        const skillIds = skills.map(s => s.skill_id);
        const courseSkills = await CourseSkill.find({ skill_id: { $in: skillIds } });

        const courseIds = [...new Set(courseSkills.map(cs => cs.course_id))];
        const userCourses = await UserCourse.find({
            user_id: userId,
            course_id: { $in: courseIds },
            status: 'completed'
        });

        const userCourseMap = new Map();
        userCourses.forEach(uc => {
            if (uc.course_score) {
                userCourseMap.set(uc.course_id, uc.course_score);
            }
        });

        const courseSkillsBySkill = new Map();
        courseSkills.forEach(cs => {
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
        const skillDocs = await Skill.find({
            skill_name: { $in: skillNames },
            learning_path_id: learningPathId
        });

        const skillMap = new Map();
        skillDocs.forEach(s => skillMap.set(s.skill_name, s));

        const skillIds = skillDocs.map(s => s.skill_id);
        const courseSkills = await CourseSkill.find({
            skill_id: { $in: skillIds }
        }).sort({ bobot: -1 });

        const courseSkillsBySkillId = new Map();
        courseSkills.forEach(cs => {
            if (!courseSkillsBySkillId.has(cs.skill_id)) {
                courseSkillsBySkillId.set(cs.skill_id, []);
            }
            courseSkillsBySkillId.get(cs.skill_id).push(cs);
        });

        const allCourseIds = courseSkills.map(cs => cs.course_id);
        const courses = await Course.find({ course_id: { $in: allCourseIds } });
        const courseMap = new Map();
        courses.forEach(c => courseMap.set(c.course_id, c));

        const userCourses = await UserCourse.find({
            user_id: userId,
            course_id: { $in: allCourseIds }
        });
        const userCourseMap = new Map();
        userCourses.forEach(uc => userCourseMap.set(uc.course_id, uc));

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

            const recommendedCourses = relatedCourseSkills.map(cs => {
                const course = courseMap.get(cs.course_id);
                const userCourse = userCourseMap.get(cs.course_id);

                let status = 'not_started';
                let courseScore = null;
                let impactScore = 0;
                let shouldPrioritize = false;

                if (userCourse) {
                    status = userCourse.status;
                    courseScore = userCourse.course_score;
                }

                const bobot = cs.bobot / 100;

                if (status === 'not_started') {
                    impactScore = bobot * 5;
                    shouldPrioritize = bobot >= 0.4;
                } else if (status === 'in_progress') {
                    impactScore = bobot * 5;
                    shouldPrioritize = bobot >= 0.3;
                } else if (status === 'completed' && courseScore !== null) {
                    const gap = 5 - courseScore;
                    impactScore = bobot * gap;
                    shouldPrioritize = impactScore >= 1.0;
                }

                return {
                    id: course.course_id,
                    name: course.course_name,
                    status: status,
                    bobot: cs.bobot,
                    current_score: courseScore,
                    impact_score: parseFloat(impactScore.toFixed(2)),
                    should_prioritize: shouldPrioritize
                };
            });

            recommendedCourses.sort((a, b) => b.impact_score - a.impact_score);

            recommendations.push({
                skill: weakSkill.name,
                current_score: weakSkill.score,
                courses: recommendedCourses
            });
        }

        return recommendations;
    }
}

module.exports = SkillDashboardHandler;