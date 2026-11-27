
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaThLarge,
  FaUsers,
  FaBox,
  FaShoppingBag,
  FaCreditCard,
  FaWarehouse,
  FaCog,
  FaSignOutAlt,
  FaDollarSign,
  FaChartLine,
  FaArrowUp,
  FaExclamationTriangle
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(
          "http://localhost:5000/admin/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch dashboard data"
          );
        }

        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setError("");

      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // FORMAT CURRENCY
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  // NAVIGATION MENU
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaThLarge />,
      path: "/admin-dashboard"
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/admin-users"
    },
    {
      name: "Products",
      icon: <FaBox />,
      path: "/admin/products"
    },
    {
      name: "Orders",
      icon: <FaShoppingBag />,
      path: "/order-management"
    },
    {
      name: "Payments",
      icon: <FaCreditCard />,
      path: "/admin-payments"
    },
    {
      name: "Inventory",
      icon: <FaWarehouse />,
      path: "/admin-inventory"
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/admin-settings"
    }
  ];

  // DASHBOARD STATS
  const dashboardStats = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers />
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FaBox />
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaShoppingBag />
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: <FaDollarSign />
    }
  ];

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // SIDEBAR NAVIGATION
  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  // QUICK NAVIGATION
  const handleManageUsers = () => {
    navigate("/admin-users");
  };

  const handleManageProducts = () => {
    navigate("/admin/products");
  };

  const handleManageOrders = () => {
    navigate("/order-management");
  };

  const handleManageInventory = () => {
    navigate("/admin-inventory");
  };

  const handleManagePayments = () => {
    navigate("/admin-payments");
  };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <FaChartLine />
          <span>MYAPP ADMIN</span>
        </div>

        <p className="admin-menu-heading">MAIN MENU</p>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`admin-nav-item ${
                item.name === "Dashboard" ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* TOPBAR */}
        <header className="admin-topbar">

          <div>
            <p className="admin-greeting">
              Welcome back, Admin!
            </p>

            <h1>Dashboard</h1>

            <p className="admin-subtitle">
              Here is what's happening with your store today.
            </p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>

        </header>

        {/* ERROR */}
        {error && (
          <p style={{
            color: "#ff6b6b",
            marginBottom: "15px"
          }}>
            {error}
          </p>
        )}

        {/* DASHBOARD STATS */}
        <section className="admin-stats">

          {dashboardStats.map((stat) => (
            <div
              className="admin-stat-card"
              key={stat.title}
            >

              <div className="admin-stat-top">
                <span>{stat.title}</span>

                <div className="admin-stat-icon">
                  {stat.icon}
                </div>
              </div>

              <h2>
                {loading ? "..." : stat.value}
              </h2>

              <p className="admin-stat-change">
                <FaArrowUp />
                <span> Live database data</span>
              </p>

            </div>
          ))}

        </section>

        {/* CONTENT GRID */}
        <section className="admin-content-grid">

          {/* SALES OVERVIEW */}
          <div className="admin-panel admin-sales-panel">

            <div className="admin-panel-heading">

              <div>
                <h2>Sales Overview</h2>
                <p>Your store performance</p>
              </div>

              <select aria-label="Sales period" defaultValue="week">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

            </div>

            <div className="admin-chart">

              {[45, 70, 50, 85, 60, 95, 75].map(
                (height, index) => (
                  <div
                    className="admin-chart-column"
                    key={index}
                  >

                    <div
                      className="admin-chart-bar"
                      style={{ height: `${height}%` }}
                      title={`${height}%`}
                    />

                    <span>
                      {[
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"
                      ][index]}
                    </span>

                  </div>
                )
              )}

            </div>

            <p className="admin-chart-note">
              <FaChartLine />
              Sales activity throughout the week
            </p>

          </div>

          {/* QUICK OVERVIEW */}
          <div className="admin-panel admin-quick-panel">

            <h2>Quick Overview</h2>

            <p className="admin-panel-description">
              Manage your store quickly.
            </p>

            <button
              type="button"
              className="admin-quick-item"
              onClick={handleManageUsers}
            >
              <FaUsers />
              <span>Manage Users</span>
              <span className="admin-quick-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-quick-item"
              onClick={handleManageProducts}
            >
              <FaBox />
              <span>Manage Products</span>
              <span className="admin-quick-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-quick-item"
              onClick={handleManageOrders}
            >
              <FaShoppingBag />
              <span>Manage Orders</span>
              <span className="admin-quick-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-quick-item"
              onClick={handleManagePayments}
            >
              <FaCreditCard />
              <span>Manage Payments</span>
              <span className="admin-quick-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-quick-item"
              onClick={handleManageInventory}
            >
              <FaWarehouse />
              <span>Manage Inventory</span>
              <span className="admin-quick-arrow">→</span>
            </button>

            {/* INVENTORY ALERT NAVIGATION */}
            <button
              type="button"
              className="admin-quick-item"
              onClick={handleManageInventory}
            >
              <FaExclamationTriangle />
              <span>View Inventory Alerts</span>
              <span className="admin-quick-arrow">→</span>
            </button>

          </div>

        </section>

        {/* RECENT ORDERS */}
        <section className="admin-panel admin-orders-panel">

          <div className="admin-panel-heading">

            <div>
              <h2>Recent Orders</h2>
              <p>Latest orders placed in your store</p>
            </div>

            <button
              type="button"
              className="admin-view-all"
              onClick={handleManageOrders}
            >
              View All →
            </button>

          </div>

          <div className="admin-table-wrapper">

            <table className="admin-orders-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="5">Loading orders...</td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5">No orders found</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (

                    <tr key={order._id}>

                      <td>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td>
                        {order.user?.name || "Unknown Customer"}
                      </td>

                      <td>
                        {order.items
                          ?.map((item) => item.name)
                          .join(", ") || "No Products"}
                      </td>

                      <td>
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td>
                        <span
                          className={`admin-status admin-status-${(
                            order.orderStatus || "placed"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* FOOTER */}
        <footer className="admin-footer">
          © 2026 MYAPP Admin Panel
        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;
