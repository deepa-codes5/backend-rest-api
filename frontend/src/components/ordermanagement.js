
import "./ordermanagement.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
  FaEye,
  FaBox
} from "react-icons/fa";

const API_URL = "http://localhost:5000/admin/orders";

const ORDER_STATUSES = [
  "Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

function OrderManagement() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

 
  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === id
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      setSelectedOrder((previousOrder) =>
        previousOrder && previousOrder._id === id
          ? { ...previousOrder, orderStatus: newStatus }
          : previousOrder
      );

      setMessage("Order status updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };


  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.name || "";
    const orderId = order._id || "";

    const searchMatch =
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.email || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const filterMatch =
      filter === "All" || order.orderStatus === filter;

    return searchMatch && filterMatch;
  });


  const totalOrders = orders.length;

  const placedOrders = orders.filter(
    (order) => order.orderStatus === "Placed"
  ).length;

  const shippedOrders = orders.filter(
    (order) =>
      order.orderStatus === "Shipped" ||
      order.orderStatus === "Out for Delivery"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  ).length;


  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

 
  const getProducts = (order) => {
    if (!order.items || order.items.length === 0) {
      return "No products";
    }

    return order.items
      .map((item) => item.name || item.product?.name || "Product")
      .join(", ");
  };


  const getStatusClass = (status) => {
    return (status || "")
      .toLowerCase()
      .replaceAll(" ", "-");
  };

 
  const getPaymentClass = (status) => {
    return (status || "pending").toLowerCase();
  };

  return (
    <div className="order-management">

      <button
        className="order-back-btn"
        onClick={() => navigate("/admin-dashboard")}
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="order-heading">
        <div>
          <h1>Order Management</h1>
          <p>View and manage all customer orders</p>
        </div>

        <FaBox className="order-heading-icon" />
      </div>

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div className="order-message success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="order-message error-message">
          {error}
        </div>
      )}

      {/* ORDER STATISTICS */}
      <div className="order-stats">

        <div className="order-stat-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
        </div>

        <div className="order-stat-card">
          <span>Placed Orders</span>
          <h2>{placedOrders}</h2>
        </div>

        <div className="order-stat-card">
          <span>Shipped Orders</span>
          <h2>{shippedOrders}</h2>
        </div>

        <div className="order-stat-card">
          <span>Delivered Orders</span>
          <h2>{deliveredOrders}</h2>
        </div>

      </div>

      {/* SEARCH AND FILTER */}
      <div className="order-toolbar">

        <div className="order-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search order ID, customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="order-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Orders</option>

          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

      </div>

      {/* ORDERS TABLE */}
      <div className="order-table-wrapper">

        <table className="order-table">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="8" className="order-empty">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="order-empty">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (

                <tr key={order._id}>

                  <td>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>

                  <td>
                    {order.user?.name || "Unknown"}
                  </td>

                  <td>
                    {getProducts(order)}
                  </td>

                  <td>
                    {formatDate(order.createdAt)}
                  </td>

                  <td>
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`payment-badge ${getPaymentClass(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || "PENDING"}
                    </span>
                    <div className="order-payment-method">
                      {order.paymentMethod || "-"}
                    </div>
                  </td>

                  <td>
                    <select
                      className={`status-select ${getStatusClass(
                        order.orderStatus
                      )}`}
                      value={order.orderStatus}
                      disabled={
                        updatingId === order._id ||
                        order.orderStatus === "Delivered" ||
                        order.orderStatus === "Cancelled"
                      }
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      className="order-view-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FaEye /> View
                    </button>
                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      
      {selectedOrder && (

        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >

          <div
            className="order-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="order-modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h2>Order Details</h2>

            <p>
              <strong>Order ID:</strong>{" "}
              #{selectedOrder._id.slice(-8).toUpperCase()}
            </p>

            <p>
              <strong>Customer:</strong>{" "}
              {selectedOrder.user?.name || "-"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedOrder.user?.email || "-"}
            </p>

            <p>
              <strong>Mobile:</strong>{" "}
              {selectedOrder.user?.mobileNumber || "-"}
            </p>

            <p>
              <strong>Products:</strong>{" "}
              {getProducts(selectedOrder)}
            </p>

            <p>
              <strong>Quantity:</strong>{" "}
              {selectedOrder.items?.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
              )}
            </p>

            <p>
              <strong>Subtotal:</strong>{" "}
              ₹{selectedOrder.subtotal || 0}
            </p>

            <p>
              <strong>Shipping:</strong>{" "}
              ₹{selectedOrder.shipping || 0}
            </p>

            <p>
              <strong>Discount:</strong>{" "}
              ₹{selectedOrder.discount || 0}
            </p>

            <p>
              <strong>Total Amount:</strong>{" "}
              ₹{selectedOrder.totalAmount || 0}
            </p>

            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedOrder.paymentMethod || "-"}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              {selectedOrder.paymentStatus || "-"}
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              {selectedOrder.orderStatus || "-"}
            </p>

            <p>
              <strong>Order Date:</strong>{" "}
              {formatDate(selectedOrder.createdAt)}
            </p>

            <button
              className="order-modal-done"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default OrderManagement;
