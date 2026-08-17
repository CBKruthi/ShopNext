import express from "express";
const router = express.Router();
import { RegisterUser,loginUser,getUsers,verifyEmail, makeAdmin } from "../controller/authController.js";
import {protect} from "../middleware/authMiddleware.js"
import {admin} from "../middleware/adminMiddleware.js"

router.post("/register", RegisterUser);
router.get("/users",protect,admin , getUsers);
router.post("/verify-email", verifyEmail);
router.post("/login",loginUser);


router.put("/make-admin", makeAdmin);

export default router;