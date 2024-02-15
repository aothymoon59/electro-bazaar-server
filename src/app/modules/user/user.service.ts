import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import { Response } from 'express';

import { ILoginUser, IRegisterUser } from './user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import sendToken from '../../utils/jwt';
import config from '../../config';

const createUserIntoDb = async (payload: IRegisterUser, res: Response) => {
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, 'user already exists');
  }

  const user = await User.create(payload);

  sendToken(user, res, 'registration successfully');
};
const loginUser = async (payload: ILoginUser, res: Response) => {
  const isUserExists = await User.findOne({ email: payload.email }).select(
    '+password',
  );
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  const isPasswordMatch = await isUserExists.comparePassword(payload.password);

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, 'invalid credential');
  }

  sendToken(isUserExists, res, 'login successfully');
};

const refreshToken = async (token: string, res: Response) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { id } = decoded;

  // checking if the user is exist
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  sendToken(user, res, 'Access token is retrieved successfully!');
};

export const UserServices = { createUserIntoDb, loginUser, refreshToken };
