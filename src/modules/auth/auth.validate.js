import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUpVal=joi.object({
    name:generalFields.name.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    phone:generalFields.phone.required(),
    cPassword:generalFields.cPassword.required(),
    DOB:generalFields.DOB
})
export const loginVal=joi.object({
    phone:generalFields.phone.when('email',{
        is:joi.exist(),
        then:joi.optional(),
        otherwise:joi.required()
    }),
    email:generalFields.email,
    password:generalFields.password.required()
})