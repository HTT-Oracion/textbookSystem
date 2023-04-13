import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { getKey } from "#utils/index";

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

export const passwordEncryption = (rawPassword, level = 10) => {
    return bcrypt.hashSync(rawPassword, 10)
}
