import slugify from "slugify";
import { Brand } from "../../../db/models/brand.model.js"
import { AppError } from "../../utilis/appError.js"
import cloudinary from "../../utilis/cloud.js"

export const addBrand = async (req, res, next) => {
    let { name } = req.body;
    name = name.toLowerCase();
    const brandExist = await Brand.findOne({ name });
    if (brandExist) {
      return next(new AppError("Brand already exists", 409));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads/brand"
    });
    req.failImage = [{ public_id }];
    const slug = slugify(name);
    const brand = new Brand({
      name,
      slug,
      logo: { secure_url, public_id }
    });
    const createdBrand = await brand.save();
    if (!createdBrand) {
      return next(new AppError("Failed to create brand in database", 500));
    }
    req.failImage = [];
    return res.status(201).json({
      message: "Brand created successfully",
      success: true,
      data: createdBrand
    });
  };
export const getAllBrands = async (req, res, next) => {
    const brands = await Brand.find(); 
    if (!brands) {
        return next(new AppError('No brands found', 404));
    }
    return res.status(200).json({
        success: true,
        data: brands
    });
};

export const getBrand = async (req, res, next) => {
    const { brandId } = req.params; 
    const brand = await Brand.findById(brandId); 
    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }
    return res.status(200).json({
        success: true,
        data: brand
    });
};

export const updateBrand=async(req,res,next)=>{
    let {name}=req.body
    const {brandId}=req.params
    name=name.toLowerCase()
    const brandExist=await Brand.findById(brandId)
    if(!brandExist){
        return next(new AppError('Brand not found',404))
    }
    const nameExist=await Brand.findOne({name,_id:{$ne:brandId}})
    if(nameExist){
        return next(new AppError('brand already exist',409))
    }
    if(name){
        const slug=slugify(name)
        brandExist.name=name
        brandExist.slug=slug
    }
    if(req.file){
        await cloudinary.uploader.destroy(brandExist.logo.public_id)
        const { secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
            // public_id:brandExist.logo.public_id
            folder:"uploads/brand"
        })
        brandExist.logo={secure_url,public_id}
        req.failImage={secure_url,public_id} 
    }
    const updatedBrand=await brandExist.save()
    if (!updatedBrand) {
        return next(new AppError('fail to update',500))
        
    }
    return res.status(200).json({
        message:"Brand updated successfully",
        success:true,
        data:updatedBrand
    })
}
export const deleteBrand = async (req, res, next) => {
    const { brandId } = req.params;
    const brand = await Brand.findById(brandId);
    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }
    if (brand.logo && brand.logo.public_id) {
        await cloudinary.uploader.destroy(brand.logo.public_id);
    }
    const deletedBrand = await Brand.findByIdAndDelete(brandId);
    if (!deletedBrand) {
        return next(new AppError('Failed to delete brand', 500));
    }
    return res.status(200).json({
        message: 'Brand deleted successfully',
        success: true,
        deletedData: deletedBrand
    });
};
