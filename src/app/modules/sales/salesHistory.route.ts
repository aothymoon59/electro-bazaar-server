import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { SalesHistoryValidations } from './salesHistory.validation';
import { SalesHistoryControllers } from './salesHistory.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-sale',
  auth(),
  validateRequest(SalesHistoryValidations.createSaleValidationSchema),
  SalesHistoryControllers.createSales,
);
router.get(
  '/get-sales-history',
  auth(USER_ROLE.user, USER_ROLE.manager, USER_ROLE.superAdmin),
  SalesHistoryControllers.getSalesHistory,
);

export const SalesHistoryRoutes = router;
