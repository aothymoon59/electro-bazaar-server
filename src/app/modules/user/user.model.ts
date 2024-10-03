import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from './../../config';
import { IUser, TPasswordHistory, UserModel } from './user.interface';

const passwordHistorySchema = new Schema<TPasswordHistory>(
  {
    password: { type: String },
  },
  {
    timestamps: true,
    _id: false,
  },
);

const userSchema = new Schema<IUser, UserModel>(
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
    passwordChangedAt: {
      type: Date,
    },
    password_history: { type: [passwordHistorySchema] },
    role: {
      type: String,
      enum: ['superAdmin', 'manager', 'user', 'customer'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; //doc
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds || 10),
  );
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.password_history;

  return user;
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

export const User = model<IUser, UserModel>('User', userSchema);
