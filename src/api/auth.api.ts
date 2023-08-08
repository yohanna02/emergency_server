import { Router } from "express";
import login from "../controller/auth/login.controller";
import register from "../controller/auth/register.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);

export default router;