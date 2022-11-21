import joi from "joi";

export const extractSchema = joi.object({
    type: joi.required().valid("deposit", "withdraw"),
    description: joi.string().min(3).required(),
    value: joi.required()
});