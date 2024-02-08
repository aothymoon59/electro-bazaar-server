import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { SalesHistoryValidations } from './salesHistory.validation';
import { SalesHistoryControllers } from './salesHistory.controller';

const router = Router();
router.post(
  '/create-sale',
  auth(),
  validateRequest(SalesHistoryValidations.createSaleValidationSchema),
  SalesHistoryControllers.createSales,
);
router.get(
  '/get-sales-history',
  auth(),
  SalesHistoryControllers.getSalesHistory,
);

export const SalesHistoryRoutes = router;
