import { postSingIn, postSingUp } from "../controllers/users.controller.js";
import {Router} from "express";

const router = Router();

router.post("/sign-up", postSingUp);

router.post("/sign-in", postSingIn);

export default router;