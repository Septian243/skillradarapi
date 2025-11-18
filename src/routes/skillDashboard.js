const Joi = require('joi');
const SkillDashboardHandler = require('../handlers/skillDashboardHandler');

const skillDashboardRoutes = [
    {
        method: 'GET',
        path: '/users/{userId}/skill-dashboard',
        handler: SkillDashboardHandler.getSkillDashboard,
        options: {
            validate: {
                params: Joi.object({
                    userId: Joi.string().required()
                }),
                query: Joi.object({
                    learning_path_id: Joi.string().optional(),
                    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional()
                })
            }
        }
    }
];

module.exports = skillDashboardRoutes;