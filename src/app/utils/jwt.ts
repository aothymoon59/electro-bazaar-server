import { Response } from 'express';

import config from '../config';
import { IUser } from '../modules/user/user.interface';

import sendResponse from './sendResponse';
import httpStatus from 'http-status';

export const refreshTokenOption = {
  exprire: config.jwt_refresh_expires_in as string,
  httpOnly: config.env === 'production',
  secure: config.env === 'production',
};

const sendToken = (user: IUser, res: Response, message: string) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  res.cookie('refresh_token', refreshToken, refreshTokenOption);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: { accessToken },
  });
};

export default sendToken;
