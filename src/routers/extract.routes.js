import { getHistory, postExtract } from "../controllers/extract.controller.js";
import {Router} from "express";

const router = Router();

router.post("/extract", postExtract);

router.get("/history", getHistory);

export default router;