import multer from "multer";
import { AppError } from "../utilis/appError.js";

export const fileValidation={
    imaga:['image/png','image/jpeg','image/jpg'],
    file:["application/pdf",'application/msword']
}

export const cloudUpload=({allowType=fileValidation.imaga})=>{
    const storage=multer.diskStorage({})
     const fileFilter=(req,file,cb)=>{
        if(!allowType.includes(file.mimetype)){
            cb(new AppError('invalid file format',400),false)
        }
        cb(null,true)
        }
        return multer({storage,fileFilter})

    
}
// export const uploadSingleFile=(fieldName,folderName)=>fileUpload(folderName).single(fieldName)
// export const uploadMixofFiles=(arrayOfFields,folderName)=>fileUpload(folderName).fields(arrayOfFields)
