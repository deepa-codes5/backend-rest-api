
import "./productManagement.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBox,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/products";

const initialForm = {
  name: "",
  description: "",
  category: "Electronics",
  price: "",
  image: "",
  stock: "",
};

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // GET ADMIN TOKEN
  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // FETCH ALL PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts(data.products || []);
    } catch (error) {
      console.log("FETCH PRODUCTS ERROR:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // SEARCH AND CATEGORY FILTER
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // STOCK STATISTICS
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const inStock = products.filter(
    (product) => product.stock > 5
  ).length;

  // OPEN ADD FORM
  const openAddForm = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "Electronics",
      price: String(product.price ?? ""),
      image: product.image || "",
      stock: String(product.stock ?? ""),
    });

    setEditId(product._id);
    setShowForm(true);
  };

  // ADD / UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !name ||
      !description ||
      !form.category ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      price <= 0 ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      toast.error("Please enter valid product details.");
      return;
    }

    if (!localStorage.getItem("token")) {
      toast.error("Admin login required. Please login again.");
      return;
    }

    const productData = {
      name,
      description,
      price,
      category: form.category,
      image: form.image.trim(),
      stock,
    };

    try {
      setSaving(true);

      const isEditing = editId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Product operation failed");
      }

      toast.success(
        isEditing
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      setForm(initialForm);
      setEditId(null);
      setShowForm(false);

      await fetchProducts();
    } catch (error) {
      console.log("SAVE PRODUCT ERROR:", error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    if (!localStorage.getItem("token")) {
      toast.error("Admin login required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      toast.success("Product deleted successfully!");

      await fetchProducts();
    } catch (error) {
      console.log("DELETE PRODUCT ERROR:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="product-management">

      {/* HEADER */}
      <div className="product-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your store products and inventory</p>
        </div>

        <button
          className="add-product-btn"
          onClick={openAddForm}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* STATISTICS */}
      <div className="product-stats">

        <div className="product-stat-card">
          <span>Total Products</span>
          <h2>{products.length}</h2>
          <FaBox className="stat-icon" />
        </div>

        <div className="product-stat-card">
          <span>In Stock</span>
          <h2>{inStock}</h2>
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

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="product-form-card">

          <div className="product-form-header">
            <h2>
              {editId ? "Edit Product" : "Add New Product"}
            </h2>

            <button
              type="button"
              className="close-form-btn"
              onClick={() => setShowForm(false)}
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

              <div className="product-field">
                <label>Product Image URL</label>
                <input
                  type="url"
                  placeholder="Enter image URL"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                />
              </div>

              <div className="product-field">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

            </div>

            <div className="product-form-actions">

              <button
                type="button"
                className="cancel-product-btn"
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                  setEditId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-btn"
                disabled={saving}
              >
                <FaSave />
                {saving
                  ? "Saving..."
                  : editId
                  ? "Update Product"
                  : "Save Product"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* PRODUCT TABLE */}
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

              {loading ? (
                <tr>
                  <td colSpan="7" className="no-products">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (

                filteredProducts.map((product) => (

                  <tr key={product._id}>

                    <td>
                      #{product._id.slice(-6)}
                    </td>

                    <td className="product-name-cell">
                      {product.name}
                    </td>

                    <td>{product.category}</td>

                    <td>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>

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
                          title="Edit product"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="delete-product-btn"
                          onClick={() => deleteProduct(product._id)}
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
