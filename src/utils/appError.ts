import logger from "../loaders/pino";

export default class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    logger.error(`ERROR ${statusCode}: ${message}`);

    Error.captureStackTrace(this, this.constructor);
  }
}
