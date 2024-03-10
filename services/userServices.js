import User from "../models/user.js";

export const findUser = (filter) => User.findOne(filter);

export const findUserById = (id) => User.findById(id);

export const updateAvatar = (id, photo) =>
  User.findByIdAndUpdate(id, { photo });

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
