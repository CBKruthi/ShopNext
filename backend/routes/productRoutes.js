import express from "express";
const router = express.Router();

import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controller/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });


router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, upload.single('image'), createProduct);
router.put("/:id", protect, admin, upload.single('image'), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;