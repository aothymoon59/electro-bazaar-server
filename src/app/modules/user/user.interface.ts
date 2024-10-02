import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'User' | 'Manager' | 'Customer' | 'SuperAdmin';
  status: 'Active' | 'Block';
  isDeleted: boolean;
  // eslint-disable-next-line no-unused-vars
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role: 'User' | 'Manager' | 'Customer';
}

export interface ILoginUser {
  email: string;
  password: string;
}
