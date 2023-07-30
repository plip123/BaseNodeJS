import { Router } from 'express';
import { getAllUsers, getCurrentUser } from '../../controllers/user';
import { deserializeUser, isAuth, rolePermission } from '../middlewares';

const router = Router();

export default (app: Router) => {
  app.use('/auth', router);
  
  router.use(deserializeUser, isAuth);

  // Admin Get All Users route
  router.get('/', rolePermission('admin'), getAllUsers);

  // Get current user info route
  router.get('/current-user', getCurrentUser);

};