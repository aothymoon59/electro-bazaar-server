import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { productServices } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const { id: addedBy } = req.user;
  const result = await productServices.createProductIntoDb({
    ...req.body,
    addedBy,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'product created successfully!',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { user: currentUser } = req;
  const result = await productServices.updateProductIntoDb(
    req?.params?.productId,
    req.body,
    currentUser,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'product updated successfully!',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await productServices.getAllProductsFromDb(req?.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'all products retrieved successfully!',
    meta: result?.meta,
    data: result?.result,
  });
});
const getSingleProduct = catchAsync(async (req, res) => {
  const result = await productServices.getSingleProductFromDb(
    req?.params?.productId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'product retrieved successfully!',
    data: result,
  });
});
const deleteProduct = catchAsync(async (req, res) => {
  const result = await productServices.deleteProductFromDb(
    req?.params?.productId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'product deleted successfully!',
    data: result,
  });
});
const deleteMultipleProducts = catchAsync(async (req, res) => {
  const result = await productServices.deleteMultipleProductsFromDb(
    req?.body?.ids,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'products deleted successfully!',
    data: result,
  });
});

export const productControllers = {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  deleteMultipleProducts,
};
