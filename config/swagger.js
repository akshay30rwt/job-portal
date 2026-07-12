const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Job Portal API',
            version: '1.0.0',
            description: 'A REST API for managing job listings with authentication'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local server' },
            { url: 'https://job-portal-awf0.onrender.com', description: 'Production server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;