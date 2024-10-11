// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import httpStatus from 'http-status';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import cartServices from './cart.service';

const createCart = catchAsync(async (req, res) => {
  const result = await cartServices.createCartIntoDb(
    req.body,
    req?.user?.email,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'cart created successfully!',
    data: result,
  });
});
const updateCartQuantity = catchAsync(async (req, res) => {
  const result = await cartServices.updateCartQuantityIntoDb(
    req.body?.type,
    req?.params?.cartId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'cart quantity updated successfully!',
    data: result,
  });
});
const getCarts = catchAsync(async (req, res) => {
  const result = await cartServices.getCartsFromDb(req.user?.email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'cart retrieved successfully!',
    data: result,
  });
});
const deleteProductFromCart = catchAsync(async (req, res) => {
  const result = await cartServices.deleteProductFromCartFromDb(
    req?.params?.cartId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'product removed from cart successfully!',
    data: result,
  });
});

const cartControllers = {
  createCart,
  getCarts,
  updateCartQuantity,
  deleteProductFromCart,
};
export default cartControllers;
