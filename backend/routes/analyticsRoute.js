import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { getAdminStats} from "../controller/analyticsController.js";

const router = express.Router();

router.get("/", protect, getAdminStats);

export default router;


