import { Router } from 'express';
import productControllers from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import productValidations from './product.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-product',
  auth(),
  validateRequest(productValidations.createProductValidationSchema),
  productControllers.createProduct,
);

router.put(
  '/update-product/:productId',
  auth(),
  productControllers.updateProduct,
);

router.get('/get-products', auth(), productControllers.getProducts);

router.get(
  '/get-product/:productId',
  auth(),
  productControllers.getSingleProduct,
);
router.delete(
  '/delete-product/:productId',
  auth(),
  productControllers.deleteProduct,
);
router.delete(
  '/delete-multiple-products',
  auth(),
  productControllers.deleteMultipleProducts,
);

const ProductRoutes = router;
export default ProductRoutes;
