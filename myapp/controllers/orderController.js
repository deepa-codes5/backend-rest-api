
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Payment = require("../models/paymentModel");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentId, discount = 0 } = req.body;

    // 1. Validate payment ID
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required"
      });
    }

    // 2. Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty"
      });
    }

    // 3. Prepare order items
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

    // 4. Calculate subtotal using database prices
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 5. Calculate shipping
    const shipping = subtotal >= 1000 ? 0 : 50;

    // 6. Validate discount
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

    // 7. Find payment
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

    // 8. Create order
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

    // 9. Link payment with order
    payment.orderId = order._id;
    await payment.save();

    // 10. Clear cart
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


// GET LOGGED-IN USER ORDERS
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


// GET SINGLE ORDER
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


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
