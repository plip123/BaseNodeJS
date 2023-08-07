import config from 'config';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import bcrypt from 'bcryptjs';
import {
  RegisterUserInput,
  LoginUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyAccessTokenInput,
  ConfirmAccountInput,
  sendVerificationTokenInput,
} from '../schemas/user';
import {
  createUserService,
  findUserService,
  updateUserService,
  createTokenService
} from '../services/user';
import Mailer from '../services/mailer';
import EmailTemplates from '../templates/index';
import AppError from '../utils/appError';
import logger from '../utils/pino';
import { verifyJwt } from '../utils/jwt';

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

export const registerController = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUserService({
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

export const loginController = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user
    const user = await findUserService({ email: req.body.email });

    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError('Invalid Email or Password', 401));
    }

    // Create Access Token
    const { accessToken } = await createTokenService(user);

    logger.info("Access token created");

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

export const sendVerificationTokenController = async (
  req: Request<{}, {}, sendVerificationTokenInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user
    const user = await findUserService({ email: req.body.email });

    if (!user) {
      return next(new AppError('Invalid Email', 401));
    }

    if (user.active) {
      return next(new AppError('Account is already activated', 402));
    }

    // Create Access Token
    const { accessToken } = await createTokenService(user, 600000); // 10min
    const url = `${req.headers['x-forwarded-proto'] ?? "http"}://${req.headers.host}/confirm-account/${accessToken}`;
    
    logger.info(`Url to send: ${url}`);

    // Send forgot password email
    const mailer = Mailer.getInstance();
    const template = EmailTemplates.genericEmail({
      title: "Confirm your account",
      message: "Please click on the button below to confirm your account.",
      textBtn: "Verify account",
      urlBtn: url
    });
    await mailer.send(String(req.headers['X-Request-Id']), {
        to: req.body.email,
        subject: 'Confirm your account',
        html: template.html,
    });
    
    logger.info("Successful account activation");

    // Send Access Token
    res.status(200).json({
      status: 'success',
      data: {},
    });
  } catch (err: any) {
    logger.error("ERROR: An error occurred while an account verification.");
    next(err);
  }
};

export const confirmAccountController = async (
  req: Request<{}, {}, ConfirmAccountInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user
    const user = await findUserService({ email: req.body.email });

    if (!user) {
      return next(new AppError('Invalid Email', 401));
    }

    if (!verifyJwt(req.body.token)) {
      return next(new AppError('Invalid Access Token', 401));
    }

    user.active = true;
    await updateUserService(user);

    logger.info("Successful account confirmation");

    res.status(201).json({
      status: 'success',
      data: {},
    });
  } catch (err: any) {
    logger.error("ERROR: An error occurred while verifying user account");
    next(err);
  }
};

export const forgotPasswordController = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user
    const user = await findUserService({ email: req.body.email });

    if (!user) {
      return next(new AppError('Invalid Email', 401));
    }

    // Create Access Token
    const { accessToken } = await createTokenService(user, 600000); // 10min
    const url = `${req.headers['x-forwarded-proto'] ?? "http"}://${req.headers.host}/recover-password/${accessToken}`;
    
    logger.info(`Url to send: ${url}`);

    // Send forgot password email
    const mailer = Mailer.getInstance();
    const template = EmailTemplates.resetPassword(url);
    await mailer.send(String(req.headers['X-Request-Id']), {
        to: req.body.email,
        subject: 'Reset Password',
        html: template.html,
        attachments: template.attachments,
    });

    res.status(201).json({
      status: 'success',
      data: {},
    });
  } catch (err: any) {
    logger.error("ERROR: An error occurred while recover password.");
    next(err);
  }
};

export const verifyAccessTokenController = async (
  req: Request<{}, {}, VerifyAccessTokenInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user
    const user = await findUserService({ email: req.body.email });

    if (!user) {
      return next(new AppError('Invalid Email', 401));
    }

    if (!verifyJwt(req.body.token)) {
      return next(new AppError('Invalid Access Token', 401));
    }

    logger.info("Successful token verification");

    res.status(201).json({
      status: 'success',
      data: {},
    });
  } catch (err: any) {
    logger.error("ERROR: An error occurred while verifed the access token");
    next(err);
  }
};

export const resetPasswordController = async (
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user
    const user = await findUserService({ email: req.body.email });

    if (!user) {
      return next(new AppError('Invalid Email', 401));
    }

    if (!verifyJwt(req.body.token)) {
      return next(new AppError('Invalid Access Token', 401));
    }

    user.password = await bcrypt.hash(req.body.password, 12);

    await updateUserService(user);

    logger.info("Successful updated user");

    // Send password changed email
    const mailer = Mailer.getInstance();
    const template = EmailTemplates.genericEmail({
      title: 'Password successfully changed',
      message: 'Your password was successfully updated. If you did not perform this action please contact our team.',
    });
    await mailer.send(String(req.headers['X-Request-Id']), {
        to: req.body.email,
        subject: 'Password changed',
        html: template.html,
    });

    res.status(201).json({
      status: 'success',
      data: {},
    });
  } catch (err: any) {
    logger.error("ERROR: An error occurred while recover password.");
    next(err);
  }
};