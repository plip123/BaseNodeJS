import config from 'config';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import { RegisterUserInput, LoginUserInput } from '../schemas/user';
import { registerUser, findUser, signToken } from '../services/user';
import AppError from '../utils/appError';
import logger from '../loaders/pino';

// Exclude this fields from the response
export const excludedFields = ['password'];

// Cookies
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('jwtConfig.jwtExpires') * 3600000
  ),
  maxAge: config.get<number>('jwtConfig.jwtExpires') * 3600000,
  httpOnly: true,
  sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production') accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await registerUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });

    logger.info("Successful user registration");

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    logger.error("ERROR: An error occurred while registering a user");

    if (err.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email already exist',
      });
    }
    next(err);
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user
    const user = await findUser({ email: req.body.email });

    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError('Invalid Email or Password', 401));
    }

    // Create Access Token
    const { accessToken } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    
    logger.info("Successful user login");

    // Send Access Token
    res.status(200).json({
      status: 'success',
      accessToken,
    });
  } catch (err: any) {
    logger.error("ERROR: An error occurred while a user was logging in.");
    next(err);
  }
};