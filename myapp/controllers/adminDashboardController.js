
const Student = require("../models/studentModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");

const getDashboardStats = async (req, res) => {
  try {
  
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      recentOrders
    ] = await Promise.all([
      Student.countDocuments({ role: "user" }),

      Product.countDocuments(),

      Order.countDocuments(),

      Order.find()
        .populate("user", "name email")
        .populate("items.product", "name image")
        .sort({ createdAt: -1 })
        .limit(4)
    ]);

   
    const successfulPayments = await Payment.find({
      paymentStatus: "SUCCESS",
      orderId: { $ne: null }
    })
      .populate("orderId", "orderStatus")
      .select("amount orderId");

    const totalRevenue = successfulPayments.reduce(
      (total, payment) => {
        if (
          payment.orderId &&
          payment.orderId.orderStatus !== "Cancelled"
        ) {
          return total + Number(payment.amount || 0);
        }

        return total;
      },
      0
    );

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",

      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      },

      recentOrders
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
