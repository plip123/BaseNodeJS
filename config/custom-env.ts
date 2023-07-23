import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️ .env file not found  ⚠️");
}

export default {
  dbConfig: {
    dbURL: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DATABASE_NAME,
    dbUser: process.env.MONGODB_USERNAME,
    dbPass: process.env.MONGODB_PASSWORD,
  },
  jwtConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
  },
  api: {
    prefix: '/api',
  },
  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    apiUsername: process.env.MAILGUN_USERNAME,
    domain: process.env.MAILGUN_DOMAIN
  }
};