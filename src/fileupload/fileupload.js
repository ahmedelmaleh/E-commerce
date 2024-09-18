import fs from 'fs'
import path from 'path';
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utilis/appError.js";

export const fileValidation={
    imaga:['image/png','image/jpeg','image/jpg'],
    file:["application/pdf",'application/msword']
}

export const fileUpload=({folder,allowType=fileValidation.imaga})=>{
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            let fullPath=path.resolve(`uploads/${folder}`)
            if(!fs.existsSync(fullPath)){
                fs.mkdirSync(`uploads/${folder}`,{recursive:true})
            }
            cb(null,`uploads/${folder}`)
        },
        filename:(req,file,cb)=>{
            cb(null,uuidv4() + "-" + file.originalname)
        }
    })
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
