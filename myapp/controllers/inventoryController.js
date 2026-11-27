
const Product = require("../models/productModel");

// GET INVENTORY
const getInventory = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true
    }).sort({ createdAt: -1 });

    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, product) => sum + Number(product.stock || 0),
      0
    );

    const lowStock = products.filter(
      product => product.stock > 0 && product.stock < 5
    ).length;

    const outOfStock = products.filter(
      product => product.stock === 0
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalStock,
        lowStock,
        outOfStock
      },
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getInventory
};
