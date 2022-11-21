import { extractSchema } from "../schemas/extractSchema.js";

export function extractValidate(req, res, next) {

    const validationStatus = extractSchema.validate(req.body, { abortEarly: false });

    if (validationStatus.error) {
        const error = validationStatus.error.details.map((detail) => detail.message);
        res.status(422).send(error);
        return;
    };

    next();
};