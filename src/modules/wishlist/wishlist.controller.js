import { Types } from "mongoose"
import { Product } from "../../../db/models/product.model.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utilis/appError.js"

export const addToWishlist=async(req,res,next)=>{
    let {productId}=req.body
    productId=new Types.ObjectId(productId)
    const{authUser}=req
    const productExist= await Product.findById(productId)
    if(!productExist){
        return next(new AppError("Product not found",404))
    }
    const user=await User.findByIdAndUpdate(req.authUser._id,{$addToSet:{wishlist:productId}},{new:true})
    return res.status(200).json({messages:"Product added to wishlist",success:true,data:user})
}

export const deleteFromWishlist = async (req, res, next) => {
    const { productId } = req.params;
    const user = await User.findById(req.authUser._id).select('wishlist');
    if (!user.wishlist.includes(productId)) {
      return res.status(404).json({ message: "Product not found in wishlist", success: false });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.authUser._id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).select();
    return res.status(200).json({ message: "Product deleted from wishlist", success: true, data: updatedUser });
  };
  