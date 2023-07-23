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
    db: process.env.DB_TYPE,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  jwtConfig: {
    jwtPublic: process.env.JWT_PUBLIC,
    jwtPrivate: process.env.JWT_PRIVATE,
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