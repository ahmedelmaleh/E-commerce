import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utilis/enums.js";
import { validate } from "../../middleware/validation.js";
import { createCouponVal } from "./coupon.validate.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { createCoupon } from "./coupon.controller.js";
const couponRouter=Router()

couponRouter.post("/",isAuthenticate(),isAuthorized([roles.ADMIN]),validate(createCouponVal),asyncHandeler(createCoupon))

export default couponRouter