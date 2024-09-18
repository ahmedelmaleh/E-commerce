import slugify from "slugify";
import { Brand } from "../../../db/models/brand.model.js";
import { Product } from "../../../db/models/product.model.js";
import { Subcategory } from "../../../db/models/subcategory.model.js";
import { AppError } from "../../utilis/appError.js";
import cloudinary from "../../utilis/cloud.js";
import { ApiFeature } from "../../utilis/apifeatures.js";

export const addProduct = async (req, res, next) => {
  const { name, description, stock, price, discount, discountType, colors, sizes, category, subcategory, brand } = req.body;
  req.failImage = [];
  const brandExist = await Brand.findById(brand);
  if (!brandExist) {
    return next(new AppError("Brand not found", 404));
  }
  const subCategoryExist = await Subcategory.findById(subcategory);
  if (!subCategoryExist) {
    return next(new AppError("Subcategory not found", 404));
  }
  const { secure_url: mainImageUrl, public_id: mainImageId } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
    folder: "uploads/products/mainImage"
  });
  const mainImage = { secure_url: mainImageUrl, public_id: mainImageId };
  req.failImage.push({ public_id: mainImageId });
  let subImages = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
      folder: "uploads/products/subImages"
    });
    subImages.push({ secure_url, public_id });
    req.failImage.push({ public_id });
  }
  const slug = slugify(name);
  const product = new Product({
    name,
    slug,
    description,
    stock,
    price,
    discount,
    discountType,
    colors: JSON.parse(colors),
    sizes: JSON.parse(sizes),
    category,
    subcategory,
    brand,
    mainImage,
    subImages
  });
  const createdProduct = await product.save();
  if (!createdProduct) {
    return next(new AppError("Failed to save product in the database", 500));
  }
  req.failImage = [];
  return res.status(201).json({
    message: "Product created successfully",
    success: true,
    data: createdProduct
  });
};
export const getAllProducts = async (req, res, next) => {
    const apiFeature=new ApiFeature(Product.find(),req.query).pagination().sort().select().filter()
    const products=await apiFeature.mongooseQuery
    return res.status(200).json({
      success: true,
      data: products
    });
  };
  
export const getProduct = async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    return res.status(200).json({
      success: true,
      data: product
    });
  };

  export const updateProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { name, description, stock, price, discount, discountType, colors, sizes, category, subcategory, brand } = req.body;
    const productExist = await Product.findById(productId);
    if (!productExist) {
      return next(new AppError("Product not found", 404));
    }
    const nameExist = await Product.findOne({ name, _id: { $ne: productId } });
    if (nameExist) {
      return next(new AppError("Product with the same name already exists", 409));
    }
    if (name) {
      productExist.name = name.toLowerCase();
      productExist.slug = slugify(name.toLowerCase());
    }
    if (description) productExist.description = description;
    if (stock) productExist.stock = stock;
    if (price) productExist.price = price;
    if (discount) productExist.discount = discount;
    if (discountType) productExist.discountType = discountType;
    if (colors) productExist.colors = JSON.parse(colors);
    if (sizes) productExist.sizes = JSON.parse(sizes);
  
    if (category) {
      const categoryExist = await Category.findById(category);
      if (!categoryExist) {
        return next(new AppError("Category not found", 404));
      }
      productExist.category = category;
    }
    if (subcategory) {
      const subCategoryExist = await Subcategory.findById(subcategory);
      if (!subCategoryExist) {
        return next(new AppError("Subcategory not found", 404));
      }
      productExist.subcategory = subcategory;
    }
    if (brand) {
      const brandExist = await Brand.findById(brand);
      if (!brandExist) {
        return next(new AppError("Brand not found", 404));
      }
      productExist.brand = brand;
    }
    if (req.files.mainImage) {
      if (productExist.mainImage && productExist.mainImage.public_id) {
        await cloudinary.uploader.destroy(productExist.mainImage.public_id);
      }
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
        folder: "uploads/products/mainImage"
      });
      productExist.mainImage = { secure_url, public_id };
    }
    if (req.files.subImages) {
      if (productExist.subImages && productExist.subImages.length) {
        for (const image of productExist.subImages) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        }
      }
      let newSubImages = [];
      for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
          folder: "uploads/products/subImages"
        });
        newSubImages.push({ secure_url, public_id });
      }
      productExist.subImages = newSubImages;
    }
    const updatedProduct = await productExist.save();
    if (!updatedProduct) {
      return next(new AppError("Failed to update product", 500));
    }
    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: updatedProduct
    });
  };
  export const deleteProduct = async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    if (product.mainImage && product.mainImage.public_id) {
      await cloudinary.uploader.destroy(product.mainImage.public_id);
    }
    if (product.subImages && product.subImages.length) {
      for (const image of product.subImages) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return next(new AppError("Failed to delete product", 500));
    }
    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      deletedData: deletedProduct
    });
  };
  
  

  
