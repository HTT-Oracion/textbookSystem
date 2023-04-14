import jwt from 'jsonwebtoken'
import { getKey } from './system';
const expiresIn = 3600 * 24 * 3; // 3天
export const generateToken = (signParams) => {
  const token =
    "Bearer " +
    jwt.sign(
      {
        ...signParams,
      },
      getKey(),
      { expiresIn }
    );
  return token;
};

export const decodeToken = (token) => {
    const key = getKey()
    let decoded
    try {
    decoded = jwt.verify(token, key)
    } catch (error){
        console.log('jwt verify token fail', error);
    }
    return decoded
}