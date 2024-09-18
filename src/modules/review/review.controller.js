import { Product } from "../../../db/models/product.model.js"
import { Review } from "../../../db/models/review.model.js"
import { AppError } from "../../utilis/appError.js"
import { roles } from "../../utilis/enums.js"

export const addReview=async(req,res,next)=>{
    const {comment,rate}=req.body
    const {productId}=req.params
    const productExist=await Product.findById(productId)
    if(!productExist){
        return next(new AppError("Product not found",404))
    }
    const reviewExist=await Review.findOneAndUpdate({user:req.authUser._id,product:productId})
    let message="Review updated successfully"
    let data=reviewExist
    if(!reviewExist){
        const review=new Review({
            comment,
            rate,
            user:req.authUser._id,
            product:productId
        })
        const createdReview=await review.save()
        if(!createdReview){
            return next(new AppError("fail to create",500))
        }
        message="Review created successfully"
        data=createdReview
    }
    return res.status(201).json({
        message,
        success: true,
        data
      });
}
export const getAllReviews = async (req, res, next) => {
    const reviews = await Review.find().populate('user', 'name').populate('product', 'name');
    if (!reviews) {
      return next(new AppError("No reviews found", 404));
    }
    return res.status(200).json({
      message: "Reviews retrieved successfully",
      success: true,
      data: reviews
    });
  };
  export const getReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('user', 'name').populate('product', 'name');
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    return res.status(200).json({
      message: "Review retrieved successfully",
      success: true,
      data: review
    });
  };
  export const deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    if (review.user.toString() !== req.authUser._id.toString() && req.authUser.role !== roles.ADMIN) {
      return next(new AppError("You are not authorized to delete this review", 403));
    }
    const deletedReview = await Review.findByIdAndDelete(reviewId);
  
    if (!deletedReview) {
      return next(new AppError("Failed to delete review", 500));
    }
    return res.status(200).json({
      message: "Review deleted successfully",
      success: true
    });
  };
  
  