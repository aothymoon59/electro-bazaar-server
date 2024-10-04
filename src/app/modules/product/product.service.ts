/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';

import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';
import { USER_ROLE } from '../user/user.constant';

const createProductIntoDb = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

const updateProductIntoDb = async (
  id: string,
  payload: IProduct,
  currentUser: any,
) => {
  // 1. Find the product by its ID
  const product = await Product.findById(id);

  // 2. If product not found, throw an error
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // 3. Check if the current user is allowed to update the product
  if (
    currentUser.role === USER_ROLE.user &&
    product.addedBy.toString() !== currentUser.id.toString()
  ) {
    // If the user is trying to update a product they didn't add, throw an error
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to update this product',
    );
  }

  // 4. Extract features and other remaining data from the payload
  const { features, ...remainingData } = payload;
  const modifiedData: any = { ...remainingData }; // Initialize modifiedData with the remaining data

  // 5. If features are provided, handle them separately and update them
  if (features && Object.keys(features).length) {
    for (const [key, value] of Object.entries(features)) {
      modifiedData[`features.${key}`] = value; // Create dynamic paths like 'features.color' or 'features.size'
    }
  }

  // 6. Update the product in the database
  const result = await Product.findByIdAndUpdate(
    id,
    { $set: { ...modifiedData } }, // Use the modifiedData for the update
    { new: true }, // Return the updated document
  );

  // 7. Return the updated product
  return result;
};

const getAllProductsFromDb = async (query: any) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery.populate('addedBy');
  const meta = await productQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleProductFromDb = async (productId: string) => {
  const result = await Product.findById(productId);
  return result;
};
const deleteProductFromDb = async (productId: string) => {
  const result = await Product.findByIdAndDelete(productId);
  return result;
};
const deleteMultipleProductsFromDb = async (productIds: string[]) => {
  if (!productIds) {
    throw new AppError(httpStatus.BAD_REQUEST, 'ids is required');
  }

  const filter: any = {
    _id: {
      $in: productIds.map((id: string) => new mongoose.Types.ObjectId(id)),
    },
  };
  const result = await Product.deleteMany(filter);
  return result;
};

export const productServices = {
  createProductIntoDb,
  updateProductIntoDb,
  getAllProductsFromDb,
  getSingleProductFromDb,
  deleteProductFromDb,
  deleteMultipleProductsFromDb,
};
