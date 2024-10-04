import { Router } from 'express';
import { productControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { productValidations } from './product.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-product',
  auth(USER_ROLE.user, USER_ROLE.manager, USER_ROLE.superAdmin),
  validateRequest(productValidations.createProductValidationSchema),
  productControllers.createProduct,
);

router.put(
  '/update-product/:productId',
  auth(USER_ROLE.user, USER_ROLE.manager, USER_ROLE.superAdmin),
  validateRequest(productValidations.updateProductValidationSchema),
  productControllers.updateProduct,
);

router.get('/get-products', productControllers.getAllProducts);

router.get('/get-product/:productId', productControllers.getSingleProduct);
router.delete(
  '/delete-product/:productId',
  auth(USER_ROLE.manager, USER_ROLE.superAdmin),
  productControllers.deleteProduct,
);
router.delete(
  '/delete-multiple-products',
  auth(USER_ROLE.manager, USER_ROLE.superAdmin),
  productControllers.deleteMultipleProducts,
);

export const ProductRoutes = router;
