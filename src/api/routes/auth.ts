import { Router, Request, Response, NextFunction } from 'express';
import { loginController, registerController } from '../../controllers/auth';
import { validate } from '../middlewares';
import { registerUserSchema, loginUserSchema } from '../../schemas/user';

const router = Router();

export default (app: Router) => {
  app.use('/auth', router);
  
  // Register user route
  router.post('/register', validate(registerUserSchema), registerController);
  
  // Login user route
  router.post('/login', validate(loginUserSchema), loginController);

  // TODO: Logout user route
  // router.post('/logout', validate);

  // TODO: Reset password
  // router.post('/reset-password', validate);

  // TODO: Confirm account
  // router.post('/confirm-account', validate);

  // TODO: New password
  // router.post('/new-password', validate);
};