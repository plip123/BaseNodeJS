import { Router } from 'express';
import {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
} from '../../controllers/auth';
import { validate } from '../middlewares';
import {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../../schemas/user';

const router = Router();

export default (app: Router) => {
  app.use('/auth', router);
  
  // Register user route
  router.post('/register', validate(registerUserSchema), registerController);
  
  // Login user route
  router.post('/login', validate(loginUserSchema), loginController);
  
  // Forgot password route
  router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);

  // Reset user password route
  router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);

  // TODO: Logout user route
  // router.post('/logout', validate);

  // TODO: Confirm account
  // router.post('/confirm-account', validate);
};