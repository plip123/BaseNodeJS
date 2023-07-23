import config from 'config';
import { omit } from 'lodash';
import { FilterQuery, QueryOptions } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import userModel, { User } from '../models/user';
import { excludedFields } from '../controllers/auth';
import { signJwt } from '../utils/jwt';

// RegisterUser service
export const registerUser = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

// Find User by ID
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};

// Find an user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOne(query, {}, options).select('+password');
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {
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