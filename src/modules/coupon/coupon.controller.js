import { Coupon } from "../../../db/models/coupon.model.js"
import { AppError } from "../../utilis/appError.js"
import { couponTypes } from "../../utilis/enums.js"

export const createCoupon=async(req,res,next)=>{
    const {couponCode,couponAmount,couponType,fromDate,toDate}=req.body
    const couponExist=await Coupon.findOne({couponCode})
    if(couponExist){
        return next(new AppError("coupon already exist",409))
    }
    if(couponType==couponTypes.PERCENTAGE&&couponAmount>100){
        return next(new AppError("must be less than 100",400))
    }
    const coupon=new Coupon({
        couponCode,couponAmount,couponType,fromDate,toDate,createdBy:req.authUser._id
    })
    const createdCoupon=await coupon.save()
    if(!createdCoupon){
        return next(new AppError("fail to create",500))
    }
    return res.status(201).json({
        message: "Coupon created successfully",
        success: true,
        data: createdCoupon
      });

}