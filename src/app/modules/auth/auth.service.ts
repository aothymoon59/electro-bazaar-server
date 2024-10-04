/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../user/user.model';
import { ILoginUser, IRegisterUser } from '../user/user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
// import { sendEmail } from '../../utils/sendMail';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from 'moment';
import sendResponse from '../../utils/sendResponse';
import { Response } from 'express';
import sendMail from '../../utils/sendMail';
import ejs from 'ejs';
import path from 'path';

const createUserIntoDb = async (payload: IRegisterUser) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(httpStatus.CONFLICT, 'user already exists');
  }

  const result = await User.create(payload);

  //create token and sent to the  client

  const jwtPayload = {
    id: result._id,
    name: result.name,
    email: result.email,
    role: result.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: ILoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the  client

  const jwtPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  res: Response,
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  const lastTwoPasswordsAndCurrent = user.password_history.slice(-3);

  const isPasswordRepeated = lastTwoPasswordsAndCurrent.some((history) => {
    return bcrypt.compareSync(payload?.newPassword, history.password);
  });

  if (isPasswordRepeated) {
    const lastUseData: any = lastTwoPasswordsAndCurrent.find((history) => {
      return bcrypt.compareSync(payload?.newPassword, history.password);
    });

    const formattedLastUsedDate = lastUseData
      ? moment(lastUseData.createdAt).format('YYYY-MM-DD [at] hh-mm A')
      : '';

    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: `Password change failed. Ensure the new password is unique and not among the last 2 used (last changed on ${formattedLastUsedDate}).`,
      data: null,
    });
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const newPasswordObject = {
    password: newHashedPassword,
  };

  await User.findByIdAndUpdate(userData.id, {
    $set: { password: newHashedPassword },
    $push: { password_history: newPasswordObject },
    passwordChangedAt: new Date(),
  });

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken} `;

  // send mail
  const date = moment(Date.now()).format('D MMM YYYY');
  const data = {
    date,
    resetUILink,
  };
  await ejs.renderFile(
    path.join(__dirname, '../../mails/forgot-password-mail.ejs'),
    data,
  );
  try {
    await sendMail({
      email: user.email,
      subject: 'Reset your password within ten mins!',
      template: 'forgot-password-mail.ejs',
      data,
    });
    return null;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const resetPassword = async (
  res: Response,
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (payload.email !== decoded.email) {
    console.log(payload.email, decoded.email);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  const lastTwoPasswordsAndCurrent = user.password_history.slice(-3);

  const isPasswordRepeated = lastTwoPasswordsAndCurrent.some((history) => {
    return bcrypt.compareSync(payload?.newPassword, history.password);
  });

  if (isPasswordRepeated) {
    const lastUseData: any = lastTwoPasswordsAndCurrent.find((history) => {
      return bcrypt.compareSync(payload?.newPassword, history.password);
    });

    const formattedLastUsedDate = lastUseData
      ? moment(lastUseData.createdAt).format('YYYY-MM-DD [at] hh-mm A')
      : '';

    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: `Password change failed. Ensure the new password is unique and not among the last 2 used (last changed on ${formattedLastUsedDate}).`,
      data: null,
    });
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const newPasswordObject = {
    password: newHashedPassword,
  };

  await User.findByIdAndUpdate(decoded.id, {
    $set: { password: newHashedPassword },
    $push: { password_history: newPasswordObject },
    passwordChangedAt: new Date(),
  });

  // await User.findOneAndUpdate(
  //   {
  //     id: decoded.id,
  //     role: decoded.role,
  //   },
  //   {
  //     password: newHashedPassword,
  //     passwordChangedAt: new Date(),
  //   },
  // );
};

export const AuthServices = {
  createUserIntoDb,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
