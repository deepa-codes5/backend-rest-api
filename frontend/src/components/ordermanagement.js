
import "./ordermanagement.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
  FaEye,
  FaBox,
} from "react-icons/fa";

function OrderManagement() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: "Arun Kumar",
      product: "Wireless Headphones",
      amount: 2499,
      date: "2026-10-27",
      status: "Pending",
      payment: "Paid",
    },
    {
      id: "ORD-1002",
      customer: "Priya",
      product: "Smart Watch",
      amount: 3999,
      date: "2026-10-27",
      status: "Processing",
      payment: "Paid",
    },
    {
      id: "ORD-1003",
      customer: "Karthik",
      product: "Bluetooth Speaker",
      amount: 1799,
      date: "2026-10-26",
      status: "Shipped",
      payment: "Paid",
    },
    {
      id: "ORD-1004",
      customer: "Divya",
      product: "Keyboard",
      amount: 1499,
      date: "2026-10-25",
      status: "Delivered",
      payment: "Paid",
    },
    {
      id: "ORD-1005",
      customer: "Rahul",
      product: "Gaming Mouse",
      amount: 999,
      date: "2026-10-25",
      status: "Cancelled",
      payment: "Pending",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  const updateStatus = (id, newStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === id
          ? { ...order, status: newStatus }
          : order
      )
    );

    setSelectedOrder((previousOrder) =>
      previousOrder && previousOrder.id === id
        ? { ...previousOrder, status: newStatus }
        : previousOrder
    );
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

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

      <div className="order-stats">
        <div className="order-stat-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
        </div>

        <div className="order-stat-card">
          <span>Pending</span>
          <h2>{pendingOrders}</h2>
        </div>

        <div className="order-stat-card">
          <span>Shipped</span>
          <h2>{shippedOrders}</h2>
        </div>

        <div className="order-stat-card">
          <span>Delivered</span>
          <h2>{deliveredOrders}</h2>
        </div>
      </div>

      <div className="order-toolbar">
        <div className="order-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="order-filter"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

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
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.date}</td>
                <td>₹{order.amount.toLocaleString("en-IN")}</td>
                <td>
                  <span className={`payment-badge ${order.payment.toLowerCase()}`}>
                    {order.payment}
                  </span>
                </td>
                <td>
                  <select
                    className={`status-select ${order.status.toLowerCase()}`}
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    aria-label={`Update status for ${order.id}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="order-view-btn"
                    onClick={() => setSelectedOrder(order)}
                    aria-label={`View ${order.id}`}
                  >
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="order-empty">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <button
              className="order-modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h2>Order Details</h2>

            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Product:</strong> {selectedOrder.product}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p>
              <strong>Amount:</strong> ₹
              {selectedOrder.amount.toLocaleString("en-IN")}
            </p>
            <p><strong>Payment:</strong> {selectedOrder.payment}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>

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
