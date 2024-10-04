import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/register-user',
  validateRequest(UserValidations.createUserValidationSchema),
  AuthController.createUser,
);
router.post(
  '/login',
  validateRequest(UserValidations.loginValidationSchema),
  AuthController.loginUser,
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
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidations.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(UserValidations.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(UserValidations.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

// router.get(
//   '/me',
//   auth(
//     USER_ROLE.superAdmin,
//     USER_ROLE.manager,
//     USER_ROLE.user,
//     USER_ROLE.customer,
//   ),
//   UserController.getMe,
// );

export const AuthRoutes = router;
