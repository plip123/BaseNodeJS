import { object, string, TypeOf } from 'zod';

export const registerUserSchema  = object({
  body: object({
    name: string({ required_error: 'Name is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid Email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid Email or Password'
    ),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid Email or Password'
    ),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid Email'
    ),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid Email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }),
});

export const verifyAccessTokenSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid Email'
    ),
    token: string({ required_error: 'Token is required' }),
  }),
});

export type RegisterUserInput = TypeOf<typeof registerUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'];
export type VerifyAccessTokenInput = TypeOf<typeof verifyAccessTokenSchema>['body'];
