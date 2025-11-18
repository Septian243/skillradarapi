const Joi = require('joi');
const UserCoursesHandler = require('../handlers/userCoursesHandler');

const userCoursesRoutes = [
    {
        method: 'GET',
        path: '/users/{userId}/courses',
        handler: UserCoursesHandler.getUserCourses,
        options: {
            validate: {
                params: Joi.object({
                    userId: Joi.string().required()
                }),
                query: Joi.object({
                    tab: Joi.string().valid('completed').optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/users/{userId}/courses/{courseId}',
        handler: UserCoursesHandler.getCourseDetail,
        options: {
            validate: {
                params: Joi.object({
                    userId: Joi.string().required(),
                    courseId: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/users/{userId}/courses/{courseId}/complete',
        handler: UserCoursesHandler.completeCourse,
        options: {
            validate: {
                params: Joi.object({
                    userId: Joi.string().required(),
                    courseId: Joi.string().required()
                })
            }
        }
    }
];

module.exports = userCoursesRoutes;