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
import { JwtPayload } from 'jsonwebtoken';

const createProductIntoDb = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

const updateProductIntoDb = async (
  id: string,
  payload: IProduct,
  currentUser: JwtPayload,
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (
    currentUser.role === USER_ROLE.user &&
    product.addedBy.toString() !== currentUser.id.toString()
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to update this product',
    );
  }

  // Extract features and other remaining data from the payload
  const { features, ...remainingData } = payload;
  const modifiedData: any = { ...remainingData }; // Initialize modifiedData with the remaining data

  //  If features are provided, handle them separately and update them
  if (features && Object.keys(features).length) {
    for (const [key, value] of Object.entries(features)) {
      modifiedData[`features.${key}`] = value; // Create dynamic paths like 'features.color' or 'features.size'
    }
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { $set: { ...modifiedData } }, // Use the modifiedData for the update
    { new: true }, // Return the updated document
  );

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

const deleteProductFromDb = async (
  productId: string,
  currentUser: JwtPayload,
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (
    currentUser.role === USER_ROLE.user &&
    product.addedBy.toString() !== currentUser.id.toString()
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to delete this product.',
    );
  }

  const result = await Product.findByIdAndDelete(productId);
  return result;
};

const deleteMultipleProductsFromDb = async (
  productIds: string[],
  currentUser: JwtPayload,
) => {
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product IDs are required');
  }

  const products = await Product.find({
    _id: {
      $in: productIds.map((id: string) => new mongoose.Types.ObjectId(id)),
    },
  });

  if (!products || products.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No products found for the provided IDs',
    );
  }

  if (currentUser.role === USER_ROLE.user) {
    const unauthorizedProducts = products.filter((product) => {
      return (
        product.addedBy &&
        product.addedBy.toString() !== currentUser.id.toString()
      );
    });

    if (unauthorizedProducts.length > 0) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are only allowed to delete products that you added.',
      );
    }
  }

  const result = await Product.deleteMany({
    _id: {
      $in: productIds.map((id: string) => new mongoose.Types.ObjectId(id)),
    },
  });

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
