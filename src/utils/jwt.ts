import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  const privateKey = Buffer.from(config.get<string>('jwtConfig.jwtPrivate'), 'base64').toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: config.get('jwtConfig.jwtAlgorithm'),
  });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = Buffer.from(config.get<string>('jwtConfig.jwtPublic'), 'base64').toString('ascii');
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};