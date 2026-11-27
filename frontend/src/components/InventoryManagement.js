
import "./inventorymanagement.css";
import { useEffect, useState } from "react";
import {
  FaBox,
  FaBoxes,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSearch,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

function InventoryManagement() {
  const API_URL = "http://localhost:5000";

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    outOfStock: 0
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // FETCH INVENTORY
  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch inventory");
      }

      setProducts(data.products || []);
      setStats(data.stats || {
        totalProducts: 0,
        totalStock: 0,
        lowStock: 0,
        outOfStock: 0
      });

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // OPEN STOCK EDIT
  const handleEdit = (product) => {
    setEditId(product._id);
    setNewStock(String(product.stock ?? 0));
    setMessage("");
  };

  // UPDATE STOCK
  const handleUpdateStock = async (id) => {
    if (
      newStock.trim() === "" ||
      !Number.isInteger(Number(newStock)) ||
      Number(newStock) < 0
    ) {
      setMessage("Please enter a valid stock quantity");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stock: Number(newStock)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Stock update failed");
      }

      setEditId(null);
      setNewStock("");
      setMessage("Stock updated successfully!");

      await fetchInventory();

    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  // SEARCH
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-page">

      <div className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Monitor and manage your product stock</p>
        </div>

        <button
          className="inventory-refresh"
          onClick={fetchInventory}
        >
          Refresh
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="inventory-stats">

        <div className="inventory-card">
          <FaBox />
          <div>
            <h3>Total Products</h3>
            <h2>{stats.totalProducts}</h2>
          </div>
        </div>

        <div className="inventory-card">
          <FaBoxes />
          <div>
            <h3>Total Stock</h3>
            <h2>{stats.totalStock}</h2>
          </div>
        </div>

        <div className="inventory-card">
          <FaExclamationTriangle />
          <div>
            <h3>Low Stock</h3>
            <h2>{stats.lowStock}</h2>
          </div>
        </div>

        <div className="inventory-card">
          <FaTimesCircle />
          <div>
            <h3>Out of Stock</h3>
            <h2>{stats.outOfStock}</h2>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <div className="inventory-toolbar">
        <div className="inventory-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search product or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <p className="inventory-message">{message}</p>
      )}

      {/* PRODUCT TABLE */}
      <div className="inventory-table-container">

        <h2>Stock Details</h2>

        {loading ? (
          <p className="inventory-empty">Loading inventory...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="inventory-empty">No products found</p>
        ) : (

          <table className="inventory-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (

                <tr key={product._id}>

                  <td>{product.name}</td>

                  <td>{product.category}</td>

                  <td>₹{product.price}</td>

                  <td>
                    {editId === product._id ? (
                      <input
                        className="stock-input"
                        type="number"
                        min="0"
                        value={newStock}
                        onChange={(e) =>
                          setNewStock(e.target.value)
                        }
                      />
                    ) : (
                      product.stock
                    )}
                  </td>

                  <td>
                    <span
                      className={`stock-status ${
                        product.stock === 0
                          ? "out"
                          : product.stock < 5
                          ? "low"
                          : "available"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock < 5
                        ? "Low Stock"
                        : "Available"}
                    </span>
                  </td>

                  <td>
                    {editId === product._id ? (
                      <div className="inventory-actions">

                        <button
                          className="stock-save"
                          disabled={saving}
                          onClick={() =>
                            handleUpdateStock(product._id)
                          }
                        >
                          <FaSave />
                        </button>

                        <button
                          className="stock-cancel"
                          onClick={() => {
                            setEditId(null);
                            setNewStock("");
                          }}
                        >
                          <FaTimes />
                        </button>

                      </div>
                    ) : (
                      <button
                        className="stock-edit"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit /> Edit Stock
                      </button>
                    )}
                  </td>

                </tr>

              ))}
            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default InventoryManagement;
