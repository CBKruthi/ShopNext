import express from "express";
const router = express.Router();
import { processPayment,verifyPayment } from "../controller/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/verify", protect, verifyPayment);
router.post("/", protect, processPayment);

export default router;