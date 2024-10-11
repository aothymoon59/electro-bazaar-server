import { Router } from 'express';
import cartControllers from './cart.controller';

import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import cartValidations from './cart.validation';

const router = Router();

router.post(
  '/create-cart',
  auth(),
  validateRequest(cartValidations.createCartValidationSchema),
  cartControllers.createCart,
);
router.patch(
  '/update-quantity/:cartId',
  auth(),
  cartControllers.updateCartQuantity,
);
router.get('/get-carts', auth(), cartControllers.getCarts);
router.delete(
  '/delete-product-from-cart/:cartId',
  auth(),
  cartControllers.deleteProductFromCart,
);

const CartRoutes = router;
export default CartRoutes;
