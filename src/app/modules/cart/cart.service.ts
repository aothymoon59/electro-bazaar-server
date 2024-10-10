/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
// import { generateQuery } from '../../utils/generateQuery';

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICart } from './cart.interface';
import Cart from './cart.model';

// import mongoose from 'mongoose';

const createCartIntoDb = async (payload: ICart, email: string) => {
  payload.email = email;
  const result = await Cart.create(payload);
  return result;
};
const updateCartQuantityIntoDb = async (type: string, id: string) => {
  if (type !== 'inc' && type !== 'dec') {
    throw new AppError(httpStatus.BAD_GATEWAY, 'invalid type');
  }

  const result = await Cart.findByIdAndUpdate(id, {
    $inc: {
      quantity: type === 'inc' ? 1 : -1,
    },
  });
  return result;
};
const getCartsFromDb = async (email: string) => {
  const result = await Cart.find({ email });
  return result;
};
const deleteProductFromCartFromDb = async (id: string) => {
  const result = await Cart.findByIdAndDelete(id);
  return result;
};

const cartServices = {
  createCartIntoDb,
  getCartsFromDb,
  updateCartQuantityIntoDb,
  deleteProductFromCartFromDb,
};
export default cartServices;
