import { Router } from "express";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { resetPassword } from "./user.controller.js";
const userRouter=Router()
userRouter.post("/reset-password",isAuthenticate(),asyncHandeler(resetPassword))
export default userRouter