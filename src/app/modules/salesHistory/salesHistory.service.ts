/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Product } from '../product/product.model';
import { ISalesHistory } from './salesHistory.interface';
import { SalesHistory } from './salesHistory.model';
import { filterSalesHistory } from '../../utils/filterSalesHistory';
import QueryBuilder from '../../builder/QueryBuilder';

/* const createSalesIntoDb = async (payload: ISalesHistory) => {
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
}; */

const createSalesIntoDb = async (payload: ISalesHistory) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Fetch the product by productId
    const product = await Product.findById(payload.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Update product quantity
    const updatedQuantity = product.quantity - payload.quantity;

    if (updatedQuantity <= 0) {
      // If quantity is zero or less, delete the product
      await Product.findByIdAndDelete(payload.productId, { session });
    } else {
      // Otherwise, update the product quantity
      await Product.findByIdAndUpdate(
        payload.productId,
        { $set: { quantity: updatedQuantity } },
        { session },
      );
    }

    // Fetch the last sales history record to get the latest `slNo`
    const lastSales = await SalesHistory.findOne({}, { slNo: 1 })
      .sort({ slNo: -1 })
      .session(session);

    // Set the `slNo` to 1 if no sales history exists, or increment it
    const newSlNo = lastSales ? lastSales.slNo + 1 : 1;

    // Add the `slNo` to the payload
    payload.slNo = newSlNo;

    // Commit the transaction and end the session
    await session.commitTransaction();
    await session.endSession();

    // Create the new sales record with the updated `slNo`
    return await SalesHistory.create(payload);
  } catch (err: any) {
    // Abort the transaction and end the session in case of an error
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getSalesHistoryFromDB = async (query: Record<string, string>) => {
  const { filterBy } = query;

  // Determine the startDate based on filterBy (day, week, month, year)
  const startDate = filterSalesHistory(filterBy); // Assuming this is your helper function

  const filterQuery: any = {};

  // Apply date filter if startDate is available
  if (startDate) {
    filterQuery.buyDate = {
      $gte: startDate,
      $lt: new Date(),
    };
  }

  // Create a QueryBuilder instance with the filtered query and incoming query parameters
  const salesQuery = new QueryBuilder(SalesHistory.find(filterQuery), query);

  // Use the query builder to handle search, filter, sort, paginate, and field selection
  const salesDataQuery = salesQuery
    .filter() // Apply any additional filters if passed in the query
    .sort() // Apply sorting based on query
    .paginate() // Handle pagination
    .fields(); // Select specific fields if necessary

  // Execute the built query
  const result = await salesDataQuery.modelQuery.exec();

  // Optionally, return pagination details using countTotal
  const meta = await salesQuery.countTotal();

  // Return the sales data along with pagination info (if needed)
  return {
    result,
    meta,
  };
};

/* const getSalesHistoryFromDB = async (query: Record<string, string>) => {
  const { filterBy } = query;

  console.log(query);

  const startDate = filterSalesHistory(filterBy);
  let filterQuery: any = {};

  if (startDate) {
    filterQuery = {
      buyDate: {
        $gte: startDate,
        $lt: new Date(),
      },
    };
  }

  // If startDate is null, it means there's no filter, so return all data
  const salesData = await SalesHistory.find({ ...filterQuery });

  return salesData;
}; */

// const getSalesHistoryFromDB = async (query: Record<string, string>) => {
//   const { filterBy } = query;

//   let filterQuery: any = {};

//   if (filterBy === 'day') {
//     filterQuery = {
//       buyDate: {
//         $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
//         $lt: new Date(),
//       },
//     };
//   } else if (filterBy === 'week') {
//     filterQuery = {
//       buyDate: {
//         $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
//         $lt: new Date(),
//       },
//     };
//   } else if (filterBy === 'month') {
//     filterQuery = {
//       buyDate: {
//         $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
//         $lt: new Date(),
//       },
//     };
//   } else if (filterBy === 'year') {
//     filterQuery = {
//       buyDate: {
//         $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
//         $lt: new Date(),
//       },
//     };
//   }

//   const salesData = await SalesHistory.find({ ...filterQuery });

//   return salesData;
// };

export const SalesHistoryServices = {
  createSalesIntoDb,
  getSalesHistoryFromDB,
};
