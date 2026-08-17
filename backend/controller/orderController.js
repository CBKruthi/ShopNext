import Order from "../models/Order.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId');
    res.json(orders);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.productId');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createOrder = async (req, res) => {
    const {
        items,
        totalAmount,
        address,
        paymentId,
        status
    } = req.body;

    try {
        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({
                message: "Items, total amount, and address are required"
            });
        }

        const order = new Order({
            userId: req.user._id,
            items,
            totalAmount,
            address,
            paymentId,
            status
        });

        const createdOrder = await order.save();

        await sendEmail(
            req.user.email,
            "Order Confirmation",
            `Your order with ID ${createdOrder._id} has been placed successfully. Total Amount: ${totalAmount}.`
        );

        res.status(201).json({
            message: "Order created successfully",
            order: createdOrder
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message
        });
    }
};

export const updateOrder = async (req, res) => {
  const { userId, items, totalAmount, status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        order.userId = userId || order.userId;
        order.items = items || order.items;
        order.totalAmount = totalAmount || order.totalAmount;
        order.status = status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);  
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await order.remove();
        res.json({ message: "Order removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


