import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { loginVal, signUpVal } from "./auth.validate.js";
import { changePassword, forgetPassword, login, signUp, verifyAccount } from "./auth.controller.js";
const authRouter=Router()
authRouter.post("/signup",validate(signUpVal),asyncHandeler(signUp))
authRouter.get('/verify/:token',asyncHandeler(verifyAccount))
authRouter.post("/login",validate(loginVal),asyncHandeler(login))
authRouter.post("/forget-password",asyncHandeler(forgetPassword))
authRouter.post("/change-password",asyncHandeler(changePassword))
export default authRouter