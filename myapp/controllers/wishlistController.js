
const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

// ADD PRODUCT TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // CHECK PRODUCT
    const product = await Product.findOne({
      _id: new mongoose.Types.ObjectId(productId),
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // FIND OR CREATE WISHLIST
    let wishlist = await Wishlist.findOne({
      user: userId
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: []
      });
    }

    // CHECK DUPLICATE
    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      await wishlist.populate("products");

      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
        wishlist
      });
    }

    // ADD PRODUCT
    wishlist.products.push(product._id);

    await wishlist.save();
    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist
    });

  } catch (error) {
    console.log("Add Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET USER WISHLIST
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({
      user: userId
    }).populate("products");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: {
          products: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      wishlist
    });

  } catch (error) {
    console.log("Get Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// REMOVE PRODUCT FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const wishlist = await Wishlist.findOne({
      user: userId
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist
    });

  } catch (error) {
    console.log("Remove Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// CLEAR WISHLIST
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({
      user: userId
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is already empty"
      });
    }

    wishlist.products = [];

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist
    });

  } catch (error) {
    console.log("Clear Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
};
