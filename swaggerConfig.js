const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition and options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Turso Mini CRUD API',
      version: '1.0.0',
      description: 'A simple CRUD API using Turso as the database',
    },
    servers: [
      {
        url: 'http://localhost:3002', // Update the server URL if needed
      },
    ],
  },
  apis: ['./server.js'], // Point this to the correct file or folder with route definitions
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
