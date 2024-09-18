import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addReviewVal=joi.object({
    comment:generalFields.comment.required(),
    rate:generalFields.rate.required(),
    productId:generalFields.objectId.required()
}).required()