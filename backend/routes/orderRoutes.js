import express from "express";
const router = express.Router();
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getOrdersByUserId, updateOrderStatus } from "../controller/orderController.js";
import {protect} from "../middleware/authMiddleware.js"
import {admin} from "../middleware/adminMiddleware.js"


router.get('/', protect, admin, getOrders);
router.get('/:id', protect, admin, getOrderById);
router.post('/', protect, admin, createOrder);
router.put('/:id', protect, admin, updateOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

router.delete('/:id', protect, admin, deleteOrder);
router.get('/user/:userId', protect, getOrdersByUserId);

export default router;

