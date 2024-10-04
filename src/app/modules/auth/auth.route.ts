import { Router } from 'express';
import { UserController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/register-user',
  validateRequest(UserValidations.createUserValidationSchema),
  UserController.createUser,
);
router.post(
  '/login',
  validateRequest(UserValidations.loginValidationSchema),
  UserController.loginUser,
);

router.post(
  '/change-password',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.manager,
    USER_ROLE.user,
    USER_ROLE.customer,
  ),
  validateRequest(UserValidations.changePasswordValidationSchema),
  UserController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidations.refreshTokenValidationSchema),
  UserController.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(UserValidations.forgetPasswordValidationSchema),
  UserController.forgetPassword,
);

export const AuthRoutes = router;
