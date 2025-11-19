const Hapi = require('@hapi/hapi');
const connectDB = require('./config/database');
const userCoursesRoutes = require('./routes/userCourses');
const skillDashboardRoutes = require('./routes/skillDashboard');
require('dotenv').config();

const init = async () => {
    await connectDB();

    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    server.route(userCoursesRoutes);
    server.route(skillDashboardRoutes);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return {
                status: 'ok',
                message: 'Skill Radar API is Running',
                timestamp: new Date().toISOString()
            };
        }
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response.isBoom) {
            const newResponse = h.response({
                error: true,
                message: response.message,
                statusCode: response.output.statusCode
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();