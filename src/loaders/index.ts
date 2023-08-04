import { Express } from 'express';
import expressLoader from './express';
import dbLoader from './db';
import swaggerLoader from './swagger';
import connectMailService from './mailer';
import Logger from '../utils/pino';

export default async ({ app } : { app: Express }) => {
  await dbLoader();
  Logger.info('♦ DB loaded');

  await swaggerLoader({ app });
  Logger.info('♦ Documentation loaded');

  await connectMailService();
  Logger.info('♦ Mailer loaded');

  await expressLoader({ app });
  Logger.info('♦ Express loaded');
};
