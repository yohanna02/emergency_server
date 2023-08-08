import { Router } from "express";

import requestApi from "./request.api";
import authApi from "./auth.api";

const router = Router();

router.use("/auth", authApi);
router.use("/request", requestApi);

export default router;