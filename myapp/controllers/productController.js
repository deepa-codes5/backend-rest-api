
const Product = require("../models/productModel");
const mongoose = require("mongoose");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid product details"
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      image: image?.trim() || "",
      stock: Number(stock)
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


// GET ALL ACTIVE PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true
    });

    if (!product) {
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

    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "image",
      "stock"
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided"
      });
    }

    if (
      updateData.name !== undefined &&
      (typeof updateData.name !== "string" ||
        !updateData.name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product name"
      });
    }

    if (
      updateData.description !== undefined &&
      (typeof updateData.description !== "string" ||
        !updateData.description.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid description"
      });
    }

    if (
      updateData.category !== undefined &&
      (typeof updateData.category !== "string" ||
        !updateData.category.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      });
    }

    if (
      updateData.price !== undefined &&
      (!Number.isFinite(Number(updateData.price)) ||
        Number(updateData.price) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid price"
      });
    }

    if (
      updateData.stock !== undefined &&
      (!Number.isInteger(Number(updateData.stock)) ||
        Number(updateData.stock) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock quantity"
      });
    }

    if (updateData.image !== undefined &&
        typeof updateData.image !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid image"
      });
    }

    if (updateData.name !== undefined) {
      updateData.name = updateData.name.trim();
    }

    if (updateData.description !== undefined) {
      updateData.description = updateData.description.trim();
    }

    if (updateData.category !== undefined) {
      updateData.category = updateData.category.trim();
    }

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    if (updateData.image !== undefined) {
      updateData.image = updateData.image.trim();
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
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

    const product = await Product.findOneAndUpdate(
      { _id: id, isActive: true },
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
