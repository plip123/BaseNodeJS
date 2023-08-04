import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("▲ .env file not found ▲");
}

export default {
  port: parseInt(process.env.PORT ?? "8000", 10),
  origin: process.env.ORIGIN,
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
    jwtExpires: process.env.JWT_EXPIRES,
  },
  api: {
    prefix: process.env.API_PREFIX,
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    tls: process.env.SMTP_TLS,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    sender: process.env.SMTP_SENDER,
  }
};