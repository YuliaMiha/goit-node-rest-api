import express from "express";

import authController from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";

import {
  signupSchema,
  signinSchema,
  verifySchema,
} from "../schemas/userSchemas.js";
import authtenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(signupSchema), authController.signup);

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.post(
  "/verify",
  validateBody(verifySchema),
  authController.resendVerifyEmail
);

authRouter.post("/signin", validateBody(signinSchema), authController.signin);

authRouter.get("/current", authtenticate, authController.getCurrent);

authRouter.post("/signout", authtenticate, authController.signout);
authRouter.patch(
  "/users/avatars",
  upload.single("photo"),
  authtenticate,
  authController.updateAvatar
);
export default authRouter;
