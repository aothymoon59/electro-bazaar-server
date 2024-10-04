import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDb(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users are retrieved successfully',
    meta: result?.meta,
    data: result.result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email, role } = req.user;

  const result = await UserServices.getMe(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getMe,
};
