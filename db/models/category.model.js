import{ model, Schema } from "mongoose";
export const categorySchema= new Schema({
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
        required:false
    },
    image:String
},{timestamps:true,versionKey:false})


categorySchema.post('init',function(doc){
    doc.image="http://localhost:3000/uploads/category/"+doc.image
})

export const Category=model('Category',categorySchema)