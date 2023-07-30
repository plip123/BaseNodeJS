import { Request, Response, NextFunction } from 'express';
import { findAllUsers } from '../services/user';
import logger from '../utils/pino';

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    logger.info("Success in getting the current user.");

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    logger.error("ERROR: Error trying to get the current user.");
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findAllUsers();

    logger.info("Success in getting all users.");

    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err: any) {
    logger.error("ERROR: Error trying to get all users.");
    next(err);
  }
};