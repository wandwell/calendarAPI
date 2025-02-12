const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Project 2 API',
        description: 'Project 2 API'
    },
    host: 'localhost:8080',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js']

swaggerAutogen(outputFile, endpointFiles, doc);