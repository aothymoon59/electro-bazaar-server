/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TPasswordHistory = {
  password: string;
  createdAt?: Date;
};

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  password_history: TPasswordHistory[];
  role: 'superAdmin' | 'manager' | 'user' | 'customer';
  status: 'active' | 'blocked';
  isDeleted: boolean;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
