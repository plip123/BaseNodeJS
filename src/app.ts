import express from 'express';
import config from 'config';
import logger from './utils/pino';

async function startServer() {
  const app = express();

  const port = config.get<number>('port');

  // Init loaders
  await require('./loaders').default({ app });

  app.listen(port, () => {
    logger.info(`
      ######################################
      ♦  Server listening on port: ${port} ♦
      ######################################
    `);
  }).on('error', err => {
    logger.error("ERROR: Error when try to init the server");
    process.exit(1);
  });
};

startServer();