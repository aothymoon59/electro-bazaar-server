/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../user/user.model';

const getAllUsersFromDb = async () => {
  const result = await User.find();
  return result;
};
const getMe = async (email: string, role: string) => {
  const result = await User.findOne({ email, role });

  return result;
};

export const UserServices = {
  getAllUsersFromDb,
  getMe,
};
