import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utilis/appError.js"
import { comparePassword, hashPassword } from "../../utilis/hash-and-compare.js"

export const resetPassword=async(req,res,next)=>{
    const {oldPassword,newPassword}=req.body
    const userId=req.authUser._id
    const match=comparePassword({password:oldPassword,hashPassword:req.authUser.password})
    if (!match){
        return next(new AppError("invalid credentials",401))
    }
    const hashedPassword=hashPassword({password:newPassword})
    await User.updateOne({_id:userId},{password:hashedPassword})
    return res.status(200).json({message:"Password updated successfully",success:true})
}