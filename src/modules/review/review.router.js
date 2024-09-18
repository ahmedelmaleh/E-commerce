import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validation.js";
import { addReviewVal } from "./review.validate.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { addReview, deleteReview, getAllReviews, getReview } from "./review.controller.js";
import { roles } from "../../utilis/enums.js";
const reviewRouter=Router()
reviewRouter.post("/:productId",isAuthenticate(),validate(addReviewVal),asyncHandeler(addReview))
reviewRouter.get("/", asyncHandeler(getAllReviews));
reviewRouter.get("/:reviewId", asyncHandeler(getReview));
reviewRouter.delete(
    "/:reviewId",
    isAuthenticate(),
    isAuthorized([roles.ADMIN, roles.USER]), 
    asyncHandeler(deleteReview)
  );
export default reviewRouter