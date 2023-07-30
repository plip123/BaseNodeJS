import { Router } from 'express';
import { getAllUsers, getCurrentUser } from '../../controllers/user';
import { deserializeUser, isAuth, rolePermission } from '../middlewares';

const router = Router();

export default (app: Router) => {
  app.use('/user', router);
  
  router.use(deserializeUser, isAuth);

  // Get current user info route
  router.get('/', getCurrentUser);
  
  // Admin Get All Users route
  router.get('/all-user', rolePermission('admin'), getAllUsers);

};