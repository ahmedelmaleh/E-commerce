import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utilis/enums.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { createOrder } from "./order.controller.js";
const orderRouter=Router()
orderRouter.post("/",
    isAuthenticate(),
    isAuthorized(Object.values(roles)),
    asyncHandeler(createOrder)
)
export default orderRouter