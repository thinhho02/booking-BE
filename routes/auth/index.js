import express from "express";
import {
  signIn,
  signUp,
  authGoogle,
  logout,
} from "../../controller/auth/index.js";
import { handleRefreshToken } from "../../controller/auth/handleRefreshToken.js";
import {
  authEmail,
  authOtp,
  changePassword,
} from "../../controller/auth/authEmail.js";
import { registerBusiness } from "../../controller/auth/registerBusiness.js";
import { verifyToken } from "../../middleware/vertifyToken.js";
import { handleToken } from "../../controller/auth/handleToken.js";
import { updateUser } from "../../controller/auth/profile.js";
import { upload } from "../../util/imageKit.js";
import { createNewHotel } from "../../controller/hotel/createNew.js";

const authRouter = express.Router();
// User
authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.post("/logout", logout);

authRouter.post("/google", authGoogle);

authRouter.get("/handletoken", handleToken);
authRouter.get("/refreshtoken", handleRefreshToken);

authRouter.post("/forgetpassword", authEmail);
authRouter.post("/changepassword", changePassword);

authRouter.post("/authotp", authOtp);

// Update profile
authRouter.put("/profile",upload.single("file"), verifyToken, updateUser);
// Register Business

authRouter.post("/registerbusiness",upload.single("file"),verifyToken, registerBusiness, createNewHotel);

export default authRouter;
