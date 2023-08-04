import express from 'express';
import config from 'config';
import logger from './utils/pino';

import MailService from './services/mailer';
import template from './templates/auth/resetPassword';

async function startServer() {
  const app = express();

  const port = config.get<number>('port');

  // Init loaders
  await require('./loaders').default({ app });

  app.listen(port, async () => {
    logger.info(`
      ######################################
      ♦  Server listening on port: ${port} ♦
      ######################################
    `);

    const mailService = MailService.getInstance();    
    await mailService.send('1', {
        to: "cpservice98@gmail.com",
        subject: 'Reset Password',
        html: template("").html,
    });
  }).on('error', err => {
    logger.error("ERROR: Error when try to init the server");
    process.exit(1);
  });
};

startServer();