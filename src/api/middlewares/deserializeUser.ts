import { Request, Response, NextFunction} from 'express';
import { findUserById } from '../../services/user';
import AppError from '../../utils/appError';
import { verifyJwt } from '../../utils/jwt';
import logger from '../../utils/pino';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new AppError('User not logged in', 401));
    }

    // Validate Access Token
    const decoded = verifyJwt<{ sub: string }>(access_token);

    if (!decoded) {
      return next(new AppError(`Invalid token or user doesn't exist`, 401));
    }    

    // Check if user still exist
    const user = await findUserById(decoded.sub);

    if (!user) {
      return next(new AppError(`User with that token no longer exist`, 401));
    }

    res.locals.user = user;

    next();
  } catch (err: any) {
    logger.error("ERROR: Error when try to deserialize the user");
    next(err);
  }
};