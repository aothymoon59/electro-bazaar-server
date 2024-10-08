import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from '../auth/auth.validation';

const router = Router();

router.get(
  '/managers-and-superadmins',
  auth(USER_ROLE.superAdmin, USER_ROLE.manager),
  UserController.getAllManagersAndSuperadmins,
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

router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.manager),
  validateRequest(UserValidations.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.post(
  '/change-role/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.manager),
  validateRequest(UserValidations.changeRoleValidationSchema),
  UserController.changeRole,
);

export const UserRoutes = router;
