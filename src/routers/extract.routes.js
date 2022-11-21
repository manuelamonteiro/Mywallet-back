import { getHistory, postExtract } from "../controllers/extract.controller.js";
import { Router } from "express";
import { extractValidate } from "../middlewares/extractValidate.middleware.js";

const router = Router();

router.post("/extract", extractValidate, postExtract);

router.get("/history", getHistory);

export default router;