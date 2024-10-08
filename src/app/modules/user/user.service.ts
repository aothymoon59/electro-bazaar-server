/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { USER_ROLE, userSearchableFields } from './user.constant';

const getAllManagersAndSuperadminsFromDb = async (query: any) => {
  const userQuery = new QueryBuilder(
    User.find({ role: { $in: [USER_ROLE.manager, USER_ROLE.superAdmin] } }),
    query,
  )
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getAllUsersFromDb = async (query: any) => {
  const userQuery = new QueryBuilder(
    User.find({ role: { $in: [USER_ROLE.user, USER_ROLE.customer] } }),
    query,
  )
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getMe = async (email: string, role: string) => {
  const result = await User.findOne({ email, role });

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const changeRole = async (id: string, payload: { role: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  getAllManagersAndSuperadminsFromDb,
  getAllUsersFromDb,
  getMe,
  changeStatus,
  changeRole,
};
