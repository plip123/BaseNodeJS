import { Router } from 'express';
import {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
  verifyAccessTokenController,
  confirmAccountController,
  sendVerificationTokenController,
} from '../../controllers/auth';
import { validate } from '../middlewares';
import {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyAccessTokenSchema,
  confirmAccountSchema,
  sendVerificationTokenSchema,
} from '../../schemas/user';

const router = Router();

export default (app: Router) => {
  app.use('/auth', router);
  
  // Register user route
  router.post('/register', validate(registerUserSchema), registerController);
  
  // Login user route
  router.post('/login', validate(loginUserSchema), loginController);
  
  // Send verification token
  router.post('/send-code', validate(sendVerificationTokenSchema), sendVerificationTokenController);

  // Verify account route
  router.post('/confirm-account', validate(confirmAccountSchema), confirmAccountController);

  // Forgot password route
  router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);

  // Verify access token
  router.post('/verify-token', validate(verifyAccessTokenSchema), verifyAccessTokenController);

  // Reset user password route
  router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);

  // TODO: Logout user route
  // router.post('/logout', validate);
};