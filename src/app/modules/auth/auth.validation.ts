import { z } from 'zod';
import { UserStatus } from '../user/user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  }),
});
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  changeStatusValidationSchema,
};
