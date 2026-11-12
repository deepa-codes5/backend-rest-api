
const Product = require("../models/productModel");
const mongoose = require("mongoose");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    console.log("GET PRODUCTS DATABASE:", Product.db.name);
    console.log("GET PRODUCTS COLLECTION:", Product.collection.name);
    console.log(
      "GET PRODUCTS IDs:",
      products.map(p => p._id.toString())
    );

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }
    
    console.log("========== PRODUCT DEBUG ==========");
console.log("DATABASE:", Product.db.name);
console.log("COLLECTION:", Product.collection.name);
console.log("REQUEST ID:", id);
const products = await Product.collection.find({}).toArray();

console.log("TOTAL PRODUCTS:", products.length);

console.log(
  "ALL IDS:",
  products.map(p => ({
    id: p._id,
    type: typeof p._id
  }))
);




  const product = await Product.findOne({
  _id: id
});
    console.log("FOUND PRODUCT:", product);
console.log("===================================");

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE PRODUCT (SOFT DELETE)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
