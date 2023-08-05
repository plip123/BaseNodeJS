import config from 'config';
import { omit } from 'lodash';
import { FilterQuery, QueryOptions } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import userModel, { User } from '../models/user';
import { excludedFields } from '../controllers/auth';
import { signJwt } from '../utils/jwt';

// Create user service
export const createUserService = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

// Find User by ID
export const findUserByIdService = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

// Find All users
export const findAllUsersService = async () => {
  return await userModel.find();
};

// Find an user by any fields
export const findUserService = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOne(query, {}, options).select('+password');
};

// Update User
export const updateUserService = async (input: Partial<User>) => {
  return await userModel.updateOne(input);
};

// Sign Token
export const signTokenService = async (user: DocumentType<User>) => {
  // Sign the access token
  const accessToken = signJwt(
    { sub: user._id },
    {
      expiresIn: `${config.get<number>('jwtConfig.jwtExpires')}h`,
    }
  );

  // Return access token
  return { accessToken };
};