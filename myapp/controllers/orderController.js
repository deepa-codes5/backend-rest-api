
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Payment = require("../models/paymentModel");


const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentId, discount = 0 } = req.body;

    
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required"
      });
    }

  
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty"
      });
    }

    const orderItems = cart.items
      .filter(item => item.product)
      .map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image || "",
        quantity: item.quantity
      }));

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found in cart"
      });
    }

   
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  
    const shipping = subtotal >= 1000 ? 0 : 50;

   
    const validDiscount = Math.min(
      subtotal,
      Math.max(0, Number(discount) || 0)
    );

    const totalAmount = subtotal + shipping - validDiscount;

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount"
      });
    }

    
    const payment = await Payment.findOne({
      _id: paymentId,
      user: userId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    if (payment.orderId) {
      return res.status(400).json({
        success: false,
        message: "Order already created for this payment"
      });
    }

    if (payment.paymentStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Payment is not pending"
      });
    }

    if (Number(payment.amount) !== Number(totalAmount)) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match order amount"
      });
    }

    
    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal,
      shipping,
      discount: validDiscount,
      totalAmount,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      payment: payment._id,
      orderStatus: "Placed"
    });

   
    payment.orderId = order._id;
    await payment.save();

 
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id
    })
      .populate("items.product")
      .populate("payment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate("items.product")
      .populate("payment");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email mobileNumber")
      .populate("items.product", "name image")
      .populate("payment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = [
      "Placed",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.orderStatus === "Cancelled" ||
        order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "This order cannot be updated"
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};

