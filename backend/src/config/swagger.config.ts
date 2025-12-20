import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Echoes On Tape API',
      version: '1.0.0',
      description: 'API documentation for Echoes On Tape platform',
      contact: {
        name: 'Echoes On Tape Support',
        email: 'support@echoesontape.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/utils/errors.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
