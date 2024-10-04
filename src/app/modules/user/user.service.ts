/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { USER_ROLE, userSearchableFields } from './user.constant';

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

export const UserServices = {
  getAllUsersFromDb,
  getMe,
};
