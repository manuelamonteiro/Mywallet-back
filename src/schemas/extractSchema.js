import joi from "joi";

export const extractSchema = joi.object({
    value: joi.required(),
    type: joi.required().valid("deposit", "withdraw"),
    description: joi.string().min(3).required()
});