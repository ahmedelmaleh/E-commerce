import { Router } from "express";
import { cloudUpload } from "../../fileupload/fileupload-cloud.js";
import { validate } from "../../middleware/validation.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "./product.controller.js";
import { addProductVal, updateProductVal } from "./product.validate.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utilis/enums.js";
const productRouter=Router()

productRouter.post("/",isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]),cloudUpload({}).fields([{name:'mainImage',maxCount:1},{name:'subImages',maxCount:5}]),
validate(addProductVal),
asyncHandeler(addProduct)
)
productRouter.get("/", asyncHandeler(getAllProducts));
productRouter.get("/:productId", asyncHandeler(getProduct));
productRouter.put(
    "/:productId",isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]),
    cloudUpload({}).fields([
      { name: 'mainImage', maxCount: 1 },
      { name: 'subImages', maxCount: 5 }
    ]),
    validate(updateProductVal),         
    asyncHandeler(updateProduct)
  );
productRouter.delete("/:productId",isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]), asyncHandeler(deleteProduct));




export default productRouter