import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { addToWishlist, deleteFromWishlist } from "./wishlist.controller.js";
const wishlistRouter=Router()

wishlistRouter.put("/",isAuthenticate(),asyncHandeler(addToWishlist))
wishlistRouter.put("/:productId",isAuthenticate(),asyncHandeler(deleteFromWishlist))

export default wishlistRouter   