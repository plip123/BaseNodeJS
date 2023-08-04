import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("▲ .env file not found ▲");
}

export default {
  port: parseInt(process.env.PORT ?? "8000", 10),
  origin: process.env.ORIGIN,
  dbConfig: {
    db: process.env.DB_TYPE_PROD,
    user: process.env.DB_USERNAME_PROD,
    pass: process.env.DB_PASSWORD_PROD,
    name: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: process.env.DB_PORT_PROD,
  },
  jwtConfig: {
    jwtPublic: process.env.JWT_PUBLIC_PROD,
    jwtPrivate: process.env.JWT_PRIVATE_PROD,
    jwtAlgorithm: process.env.JWT_ALGO_PROD,
    jwtExpires: process.env.JWT_EXPIRES_PROD,
  },
  api: {
    prefix: process.env.API_PREFIX,
  },
  mail: {
    host: process.env.SMTP_HOST_PROD,
    port: process.env.SMTP_PORT_PROD,
    tls: process.env.SMTP_TLS_PROD,
    username: process.env.SMTP_USERNAME_PROD,
    password: process.env.SMTP_PASSWORD_PROD,
    sender: process.env.SMTP_SENDER_PROD,
  }
};