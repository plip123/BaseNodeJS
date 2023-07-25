import express from 'express';
import { loginController, registerController } from '../../controllers/auth';
import { validate } from '../middlewares';
import { registerUserSchema, loginUserSchema } from '../../schemas/user';

const router = express.Router();

// Register user route
router.post('/register', validate(registerUserSchema), loginController);

// Login user route
router.post('/login', validate(loginUserSchema), registerController);

export default router;