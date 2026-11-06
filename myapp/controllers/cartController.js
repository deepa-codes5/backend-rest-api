
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

// Helper function: Cart items with product details
const getCartWithProducts = async (cart) => {
  if (!cart) {
    return { items: [] };
  }

  const items = await Promise.all(
    cart.items.map(async (item) => {
      const productId = item.product.toString();

      const product = await Product.collection.findOne({
        $or: [
          { _id: new mongoose.Types.ObjectId(productId) },
          { _id: productId }
        ]
      });

      return {
        ...item.toObject(),
        product
      };
    })
  );

  return {
    ...cart.toObject(),
    items
  };
};


// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid Product ID is required"
      });
    }

    const product = await Product.collection.findOne({
      $or: [
        { _id: new mongoose.Types.ObjectId(productId) },
        { _id: productId }
      ]
    });

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    const newQuantity = existingItem
      ? existingItem.quantity + qty
      : qty;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: qty
      });
    }

    await cart.save();

    const updatedCart = await getCartWithProducts(cart);

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: updatedCart
    });

  } catch (error) {
    console.log("ADD TO CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET CART
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [] }
      });
    }

    const populatedCart = await getCartWithProducts(cart);

    return res.status(200).json({
      success: true,
      cart: populatedCart
    });

  } catch (error) {
    console.log("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE CART QUANTITY
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid Product ID is required"
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }

    const product = await Product.collection.findOne({
      $or: [
        { _id: new mongoose.Types.ObjectId(productId) },
        { _id: productId }
      ]
    });

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    item.quantity = qty;

    await cart.save();

    const updatedCart = await getCartWithProducts(cart);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: updatedCart
    });

  } catch (error) {
    console.log("UPDATE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID"
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await getCartWithProducts(cart);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCart
    });

  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
};
