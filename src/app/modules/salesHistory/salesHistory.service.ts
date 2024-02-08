/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Product } from '../product/product.model';
import { ISalesHistory } from './salesHistory.interface';
import { SalesHistory } from './salesHistory.model';

const createSalesIntoDb = async (payload: ISalesHistory) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const product = await Product.findById(payload.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const updatedQuantity = product.quantity - payload.quantity;

    if (updatedQuantity <= 0) {
      await Product.findByIdAndDelete(payload.productId, { session });
    } else {
      await Product.findByIdAndUpdate(
        payload.productId,
        { $set: { quantity: updatedQuantity } },
        { session },
      );
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  return await SalesHistory.create(payload);
};

const getSalesHistoryFromDB = async (query: Record<string, string>) => {
  const { filterBy } = query;

  let filterQuery: any = {};

  if (filterBy === 'day') {
    filterQuery = {
      buyDate: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        $lt: new Date(),
      },
    };
  } else if (filterBy === 'week') {
    filterQuery = {
      buyDate: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        $lt: new Date(),
      },
    };
  } else if (filterBy === 'month') {
    filterQuery = {
      buyDate: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        $lt: new Date(),
      },
    };
  } else if (filterBy === 'year') {
    filterQuery = {
      buyDate: {
        $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        $lt: new Date(),
      },
    };
  }

  const salesData = await SalesHistory.find({ ...filterQuery });

  return salesData;
};

export const SalesHistoryServices = {
  createSalesIntoDb,
  getSalesHistoryFromDB,
};
