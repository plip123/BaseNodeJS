import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/appError';
import logger from '../../loaders/pino';

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return next(new AppError(`Invalid token or session has expired`, 401));
    }

    next();
  } catch (err: any) {
    logger.error("ERROR: Error verifying if the user has an active session");
    next(err);
  }
};