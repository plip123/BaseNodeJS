import mongoose from 'mongoose';
import config from 'config';

const getDbURL = () => {  
  switch (config.get('dbConfig.db')) {
    case 'mongodb':
      return `mongodb://${config.get('dbConfig.user')}:${config.get(
        'dbConfig.pass'
      )}@localhost:${config.get('dbConfig.port')}/${config.get(
        'dbConfig.name'
      )}?authSource=admin`;
    default:
      return '';
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(getDbURL());
  } catch (error) {
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;