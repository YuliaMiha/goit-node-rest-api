import User from "../models/user.js";
import bcrypt from "bcrypt";

export const signup = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const setToken = (id, token = "") =>
  User.findByIdAndUpdate(id, { token });
