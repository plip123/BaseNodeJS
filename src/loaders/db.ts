import mongoose from 'mongoose';
import config from 'config';
import logger from '../utils/pino';

const getDbURL = () => {
  switch (config.get('dbConfig.db')) {
    case 'mongodb':
      return `mongodb://${config.get('dbConfig.user')}:${config.get(
        'dbConfig.pass'
      )}@${config.get('dbConfig.host')}:${config.get('dbConfig.port')}/${config.get(
        'dbConfig.name'
      )}?authSource=admin`;
    default:
      return '';
  }
};

const connectDB = async () => {
  try {
    const db = getDbURL();

    await mongoose.connect(db);
    logger.info("-- Connected DB!");
  } catch (error) {
    setTimeout(connectDB, 5000);
    logger.error("DB connection failed");
  }
};

export default connectDB;