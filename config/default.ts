import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️ .env file not found  ⚠️");
}

export default {
  port: parseInt(process.env.PORT ?? "8000", 10),
  accessTokenExpiresIn: 15,
  origin: process.env.ORIGIN,
};