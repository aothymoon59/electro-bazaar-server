import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { UserController } from './user.controller';

const router = Router();

router.get(
  '/managers-and-superadmins',
  auth(USER_ROLE.superAdmin, USER_ROLE.manager),
  UserController.getAllUsers,
);

router.get(
  '/get-all',
  auth(USER_ROLE.superAdmin, USER_ROLE.manager),
  UserController.getAllUsers,
);

router.get(
  '/me',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.manager,
    USER_ROLE.user,
    USER_ROLE.customer,
  ),
  UserController.getMe,
);

export const UserRoutes = router;
