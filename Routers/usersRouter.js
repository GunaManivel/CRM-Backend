import express from "express";
import {
  accountActivation,
  authorizePwdReset,
  deleteOldPic,
  forgotPassword,
  handleLogin,
  handleRegisterUser,
  resendActivation,
  resetPassword,
  updatePhone,
  updateProfilePic,
} from "../Controllers/userController.js";
import { verifyAccessToken } from "../Middleware/verifyAccessToken.js";

const router = express.Router();

// User registration route
router.post("/register", handleRegisterUser);

// User login route
router.post("/login", handleLogin);

// Account activation route
router.post("/activate/:id/:token", accountActivation);

// Resend activation email route
router.post("/activate-mail", resendActivation);

// Forgot password route
router.post("/forgotpwd", forgotPassword);

// Authorize password reset route
router.post("/forgotpwd/authorize/:id/:token", authorizePwdReset);

// Reset password route
router.post("/reset-pwd/:id/:token", resetPassword);

// Update profile picture route
router.put("/update-pic", verifyAccessToken, updateProfilePic);

// Update phone number route
router.put("/update-phone", verifyAccessToken, updatePhone);

// Delete old profile picture route
router.delete("/delete-pic", verifyAccessToken, deleteOldPic);

export const userRouter = router;
