import { Router } from 'express';
import { UserController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './auth.validation';

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
  '/refresh-token',
  validateRequest(UserValidations.refreshTokenValidationSchema),
  UserController.refreshToken,
);

export const AuthRoutes = router;
