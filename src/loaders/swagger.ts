import express, { Express, Request, Response, NextFunction } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from 'config';
import logger from '../utils/pino';

export default ({ app } : { app: Express }) => {
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'BaseNodeJS API',
        description: 'BaseNodeJS API',
        contact: {
            name: 'Plip',
        },
        schemes: ['http'],
        host: `localhost:${config.get<number>('port')}`,
      },
      components: {
        securitySchemes: {
          jwt: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'JWT Authorization header using Bearer scheme',
              name: 'Authorization',
              in: 'header',
          },
        },
      },
    },
    apis: ['./docs/*.yaml'],
  };

  // Initialize swagger-jsdoc
  const swaggerDocument = swaggerJSDoc(swaggerOptions);
  logger.info("-- Swagger initialized");

  // Documentation address
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info("-- Documentation address on /docs");
};
