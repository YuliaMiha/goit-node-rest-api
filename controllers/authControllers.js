import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import path from "path";
import "dotenv/config";
import fs from "fs/promises";

const { JWT_SECRET } = process.env;

const contactsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const gravatarPath = gravatar.url(email);
  const newUser = await authServices.signup(req.body, gravatarPath);
  res.status(201).json({
    email: newUser.email,
    password: newUser.password,
    photo: newUser.gravatarPath,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.setToken(user._id, token);

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      photo: user.photo,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id);

  res.json({
    message: "No Content",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(contactsDir, filename);

  await fs.rename(oldPath, newPath);

  await jimp.read(newPath).resize(250, 250).writeAsync(newPath);

  const avatarURL = path.join(contactsDir, filename);
  const newUser = await userServices.updateAvatar(_id, avatarURL);

  res.json({ photo: newUser.avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
