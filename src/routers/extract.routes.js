import { getExtract, postExtract } from "../controllers/extract.controller.js";
import {Router} from "express";

const router = Router();

router.post("/extract", postExtract);

router.get("/extract", getExtract);

export default router;