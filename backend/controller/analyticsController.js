import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";


export const getAdminStats = async (req, res) => {
    try {
        const orders = await Order.find({});
        const totalIncome = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalUsers = await User.countDocuments({role:"user"});
        const totalProducts = await Product.countDocuments();
        const totalOrders = orders.length;
        
        res.status(200).json({
            totalIncome,
            totalUsers,
            totalProducts,
            totalOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
