import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './../../config';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,

      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(
    this.password,
    parseInt(config.bcrypt_salt_rounds || '10'),
  );
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, name: this.name },
    config.jwt_access_secret as string,
    {
      expiresIn: '60d',
    },
  );
};
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, config.jwt_refresh_secret || '', {
    expiresIn: '365d',
  });
};

const User = model<IUser>('User', userSchema);

export default User;
