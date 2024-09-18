import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { addToCart } from "./cart.controller.js";
const cartRouter=Router()
cartRouter.post("/",isAuthenticate(),asyncHandeler(addToCart))
export default cartRouter