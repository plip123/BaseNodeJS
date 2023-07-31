import { Express } from 'express';
import expressLoader from './express';
import dbLoader from './db';
import swaggerLoader from './swagger';
import logger from '../utils/pino';

export default async ({ app } : { app: Express }) => {
  await dbLoader();
  logger.info('♦ DB loaded');

  await swaggerLoader({ app });
  logger.info('♦ Documentation loaded');

  await expressLoader({ app });
  logger.info('♦ Express loaded');
};
