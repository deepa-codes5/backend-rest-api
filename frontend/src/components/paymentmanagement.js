
import "./paymentmanagement.css";
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaDownload,
} from "react-icons/fa";

function PaymentManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/admin/payments",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch payments");
        }

        setPayments(data.payments || []);

      } catch (error) {
        console.error("Payment Fetch Error:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Convert backend payment data for UI
  const formattedPayments = payments.map((payment) => {
    const status = payment.paymentStatus || "PENDING";

    const statusLabels = {
      SUCCESS: "Success",
      PENDING: "Pending",
      FAILED: "Failed",
    };

    const orderId = payment.orderId?._id
      ? `ORD-${payment.orderId._id.slice(-6).toUpperCase()}`
      : "N/A";

    return {
      id: `PAY-${payment._id.slice(-6).toUpperCase()}`,
      mongoId: payment._id,
      orderId,
      customer: payment.user?.name || "Unknown Customer",
      email: payment.user?.email || "N/A",
      amount: Number(payment.amount) || 0,
      method: payment.paymentMethod || "N/A",
      date: payment.createdAt
        ? new Date(payment.createdAt).toLocaleDateString("en-IN")
        : "N/A",
      status: statusLabels[status] || status,
      transactionId: payment.transactionId || "N/A",
    };
  });

  // Search and status filter
  const filteredPayments = formattedPayments.filter((payment) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      payment.id.toLowerCase().includes(searchValue) ||
      payment.orderId.toLowerCase().includes(searchValue) ||
      payment.customer.toLowerCase().includes(searchValue) ||
      payment.email.toLowerCase().includes(searchValue) ||
      payment.transactionId.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Dashboard statistics
  const totalRevenue = formattedPayments
    .filter((payment) => payment.status === "Success")
    .reduce((total, payment) => total + payment.amount, 0);

  const successCount = formattedPayments.filter(
    (payment) => payment.status === "Success"
  ).length;

  const pendingCount = formattedPayments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const failedCount = formattedPayments.filter(
    (payment) => payment.status === "Failed"
  ).length;

  // View payment details
  const handleView = (payment) => {
    window.alert(
      `Payment ID: ${payment.id}\n` +
      `Order ID: ${payment.orderId}\n` +
      `Customer: ${payment.customer}\n` +
      `Email: ${payment.email}\n` +
      `Amount: ₹${payment.amount}\n` +
      `Method: ${payment.method}\n` +
      `Transaction ID: ${payment.transactionId}\n` +
      `Date: ${payment.date}\n` +
      `Status: ${payment.status}`
    );
  };

  // Export payments as CSV
  const exportPayments = () => {
    const headers = [
      "Payment ID",
      "Order ID",
      "Customer",
      "Email",
      "Amount",
      "Method",
      "Transaction ID",
      "Date",
      "Status",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.orderId,
      payment.customer,
      payment.email,
      payment.amount,
      payment.method,
      payment.transactionId,
      payment.date,
      payment.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "payment-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="payment-management">

      <div className="payment-header">
        <div>
          <h1>Payment Management</h1>
          <p>Manage and monitor all payment transactions.</p>
        </div>

        <button
          className="payment-export-btn"
          onClick={exportPayments}
          disabled={loading || filteredPayments.length === 0}
        >
          <FaDownload /> Export Report
        </button>
      </div>

      <div className="payment-stats">

        <div className="payment-stat-card">
          <div className="payment-stat-icon revenue-icon">
            <FaCreditCard />
          </div>
          <p>Total Revenue</p>
          <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon success-icon">
            <FaCheckCircle />
          </div>
          <p>Successful Payments</p>
          <h2>{successCount}</h2>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon pending-icon">
            <FaClock />
          </div>
          <p>Pending Payments</p>
          <h2>{pendingCount}</h2>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon failed-icon">
            <FaTimesCircle />
          </div>
          <p>Failed Payments</p>
          <h2>{failedCount}</h2>
        </div>

      </div>

      <div className="payment-transactions">

        <div className="payment-table-header">
          <div>
            <h2>All Transactions</h2>
            <p>View and search payment records.</p>
          </div>

          <div className="payment-filters">

            <div className="payment-search">
              <FaSearch />

              <input
                type="text"
                placeholder="Search payment, order or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

          </div>
        </div>

        <div className="payment-table-wrapper">

          <table className="payment-table">

            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="8" className="payment-empty">
                    Loading payments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="payment-empty">
                    {error}
                  </td>
                </tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.mongoId}>

                    <td>{payment.id}</td>

                    <td>{payment.orderId}</td>

                    <td>{payment.customer}</td>

                    <td>
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>

                    <td>{payment.method}</td>

                    <td>{payment.date}</td>

                    <td>
                      <span
                        className={`payment-status ${payment.status.toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="payment-view-btn"
                        title="View payment details"
                        onClick={() => handleView(payment)}
                      >
                        <FaEye />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="payment-empty">
                    No payment transactions found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="payment-table-footer">
          Showing {filteredPayments.length} of {formattedPayments.length} transactions
        </div>

      </div>

    </div>
  );
}

export default PaymentManagement;
