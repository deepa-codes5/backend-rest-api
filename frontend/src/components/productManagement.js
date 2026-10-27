
import "./productManagement.css";
import { useState } from "react";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBox,
  FaTimes,
  FaSave,
} from "react-icons/fa";

function ProductManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 2499,
      stock: 15,
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: 1999,
      stock: 8,
    },
    {
      id: 3,
      name: "Running Shoes",
      category: "Footwear",
      price: 1499,
      stock: 3,
    },
  ]);

  const initialForm = {
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
  };

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const openAddForm = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });

    setEditId(product.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !name ||
      !form.category ||
      form.price.trim() === "" ||
      form.stock.trim() === "" ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      price <= 0 ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      alert("Please enter valid product details.");
      return;
    }

    if (editId !== null) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editId
            ? { ...product, ...form, name, price, stock }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        category: form.category,
        price,
        stock,
      };

      setProducts((previous) => [...previous, newProduct]);
    }

    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  const deleteProduct = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmed) {
      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );
    }
  };

  return (
    <div className="product-management">
      <div className="product-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your store products and inventory</p>
        </div>

        <button className="add-product-btn" onClick={openAddForm}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="product-stats">
        <div className="product-stat-card">
          <span>Total Products</span>
          <h2>{products.length}</h2>
          <FaBox className="stat-icon" />
        </div>

        <div className="product-stat-card">
          <span>In Stock</span>
          <h2>
            {products.filter((product) => product.stock > 5).length}
          </h2>
          <FaBox className="stat-icon" />
        </div>

        <div className="product-stat-card">
          <span>Low Stock</span>
          <h2>{lowStock}</h2>
          <FaBox className="stat-icon" />
        </div>

        <div className="product-stat-card">
          <span>Out of Stock</span>
          <h2>{outOfStock}</h2>
          <FaBox className="stat-icon" />
        </div>
      </div>

      {showForm && (
        <div className="product-form-card">
          <div className="product-form-header">
            <h2>{editId !== null ? "Edit Product" : "Add New Product"}</h2>

            <button
              type="button"
              className="close-form-btn"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="product-form-grid">
              <div className="product-field">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="product-field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Home">Home</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="product-field">
                <label>Price (₹)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="product-field">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter stock"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="product-form-actions">
              <button type="button" className="cancel-product-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>

              <button type="submit" className="save-product-btn">
                <FaSave /> {editId !== null ? "Update Product" : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="product-table-card">
        <div className="product-table-header">
          <h2>All Products</h2>

          <div className="product-filters">
            <div className="product-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="product-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Footwear">Footwear</option>
              <option value="Home">Home</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td className="product-name-cell">{product.name}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price.toLocaleString("en-IN")}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span
                        className={`product-status ${
                          product.stock === 0
                            ? "out-of-stock"
                            : product.stock <= 5
                            ? "low-stock"
                            : "in-stock"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 5
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>
                    <td>
                      <div className="product-action-buttons">
                        <button
                          className="edit-product-btn"
                          onClick={() => openEditForm(product)}
                          aria-label={`Edit ${product.name}`}
                          title="Edit product"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="delete-product-btn"
                          onClick={() => deleteProduct(product.id)}
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-products">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="product-table-footer">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}

export default ProductManagement;
