
import "./paymentmanagement.css";
import { useState } from "react";
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

  const [payments] = useState([
    {
      id: "PAY-1001",
      orderId: "ORD-1001",
      customer: "Arun Kumar",
      amount: 2500,
      method: "UPI",
      date: "2026-10-29",
      status: "Success",
    },
    {
      id: "PAY-1002",
      orderId: "ORD-1002",
      customer: "Priya",
      amount: 1200,
      method: "Card",
      date: "2026-10-29",
      status: "Pending",
    },
    {
      id: "PAY-1003",
      orderId: "ORD-1003",
      customer: "Karthik",
      amount: 800,
      method: "COD",
      date: "2026-10-28",
      status: "Failed",
    },
    {
      id: "PAY-1004",
      orderId: "ORD-1004",
      customer: "Divya",
      amount: 3500,
      method: "UPI",
      date: "2026-10-28",
      status: "Success",
    },
    {
      id: "PAY-1005",
      orderId: "ORD-1005",
      customer: "Suresh",
      amount: 1800,
      method: "Card",
      date: "2026-10-27",
      status: "Refunded",
    },
  ]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(search.toLowerCase()) ||
      payment.customer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter((payment) => payment.status === "Success")
    .reduce((total, payment) => total + payment.amount, 0);

  const successCount = payments.filter(
    (payment) => payment.status === "Success"
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.status === "Failed"
  ).length;

  const handleView = (payment) => {
    window.alert(
      `Payment ID: ${payment.id}\nOrder ID: ${payment.orderId}\nCustomer: ${payment.customer}\nAmount: ₹${payment.amount}\nMethod: ${payment.method}\nStatus: ${payment.status}`
    );
  };

  const exportPayments = () => {
    const headers = [
      "Payment ID",
      "Order ID",
      "Customer",
      "Amount",
      "Method",
      "Date",
      "Status",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.orderId,
      payment.customer,
      payment.amount,
      payment.method,
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

        <button className="payment-export-btn" onClick={exportPayments}>
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
              <option value="Refunded">Refunded</option>
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
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.orderId}</td>
                    <td>{payment.customer}</td>
                    <td>₹{payment.amount.toLocaleString("en-IN")}</td>
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
          Showing {filteredPayments.length} of {payments.length} transactions
        </div>
      </div>
    </div>
  );
}

export default PaymentManagement;
