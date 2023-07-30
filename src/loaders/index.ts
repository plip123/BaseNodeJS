import { Express } from 'express';
import expressLoader from './express';
import dbLoader from './db';
import logger from '../utils/pino';

export default async ({ app } : { app: Express }) => {
  await dbLoader();
  logger.info('♦ DB loaded');

  await expressLoader({ app });
  logger.info('♦ Express loaded');
};
