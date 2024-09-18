import { AppError } from "./appError.js"
import cloudinary from "./cloud.js"
import { deleteImage } from "./file.js"

export function asyncHandeler(fn){
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>{
            next(new AppError(err.message,err.statusCode))
        })
    }
}
export const globalHandler=async(err,req,res,next)=>{
    if (req.failImage && req.failImage?.length > 0) {
        for (const image of req.failImage) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    if(req.file){
        deleteImage(req.file.path)
    }
    
    return  res.status(err.statusCode||500).json({message:err.message,success:false})
}