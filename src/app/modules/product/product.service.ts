/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { generateQuery } from '../../utils/generateQuery';
import { IProduct } from './product.interface';
import Product from './product.model';

import mongoose from 'mongoose';

const createProductIntoDb = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

// TODO: modify response here
const updateProductIntoDb = async (id: string, payload: IProduct) => {
  const { features, ...remainingData } = payload;
  const modifiedData: any = { ...remainingData };
  //   console.log({ payload });
  //   console.log({ modifiedData });
  if (features && Object.keys(features).length) {
    for (const [key, value] of Object.entries(features)) {
      modifiedData[`features.${key}`] = value;
    }
  }
  //   console.log({ modifiedData });

  const result = await Product.findByIdAndUpdate(id, {
    $set: { ...modifiedData },
  });
  //   console.log(
  //     '30***************',
  //     await Product.findByIdAndUpdate(id, {
  //       $set: { ...modifiedData },
  //     }),
  //   );
  return result;
};
const getProductsFromDb = async (query: any) => {
  const filter = generateQuery(query);

  if (query?.searchTerms) {
    const result = await Product.find({
      name: { $regex: query?.searchTerms, $options: 'i' },
    });
    return result;
  }
  const result = await Product.find(filter);
  return result;
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

const productServices = {
  createProductIntoDb,
  updateProductIntoDb,
  getProductsFromDb,
  getSingleProductFromDb,
  deleteProductFromDb,
  deleteMultipleProductsFromDb,
};
export default productServices;
