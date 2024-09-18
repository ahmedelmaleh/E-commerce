import{ model, Schema, Types } from "mongoose";
export const SubcategorySchema= new Schema({
    name:{
        type:String,
        unique:[true,'name is required'],
        trim:true,
        required:true,
        minLength:[2,'too short category name']
    },
    slug:{
        type:String,
        lowercase:true,
        required:true,
        unique:[true,'name is required']
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:Types.ObjectId,
        ref:'Category'
    }
},{timestamps:true,versionKey:false})
export const Subcategory=model('Subcategory',SubcategorySchema)