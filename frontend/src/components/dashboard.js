
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
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
  FaBars,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FaThLarge />, path: "/admin-dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/admin-users" },
    { name: "Products", icon: <FaBox />, path: "/admin-products" },
    { name: "Orders", icon: <FaShoppingBag />, path: "/admin-orders" },
    { name: "Payments", icon: <FaCreditCard />, path: "/admin-payments" },
    { name: "Inventory", icon: <FaWarehouse />, path: "/admin-inventory" },
    { name: "Settings", icon: <FaCog />, path: "/admin-settings" },
  ];

  const stats = [
    {
      title: "Total Users",
      value: "1,250",
      change: "+12.5%",
      icon: <FaUsers />,
    },
    {
      title: "Total Products",
      value: "320",
      change: "+8.2%",
      icon: <FaBox />,
    },
    {
      title: "Total Orders",
      value: "856",
      change: "+15.3%",
      icon: <FaShoppingBag />,
    },
    {
      title: "Total Revenue",
      value: "₹1,25,000",
      change: "+10.8%",
      icon: <FaDollarSign />,
    },
  ];

  const recentOrders = [
    {
      id: "#ORD001",
      customer: "Customer One",
      product: "Wireless Headphones",
      amount: "₹2,499",
      status: "Delivered",
    },
    {
      id: "#ORD002",
      customer: "Customer Two",
      product: "Smart Watch",
      amount: "₹3,999",
      status: "Pending",
    },
    {
      id: "#ORD003",
      customer: "Customer Three",
      product: "Running Shoes",
      amount: "₹1,899",
      status: "Processing",
    },
    {
      id: "#ORD004",
      customer: "Customer Four",
      product: "Laptop Bag",
      amount: "₹999",
      status: "Cancelled",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
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
              onClick={() => {
                if (item.name === "Dashboard") {
                  navigate(item.path);
                } else {
                  alert(`${item.name} page will be added next.`);
                }
              }}
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

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-greeting">Welcome back, Admin!</p>
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

        <section className="admin-stats">
          {stats.map((stat) => (
            <div className="admin-stat-card" key={stat.title}>
              <div className="admin-stat-top">
                <span>{stat.title}</span>
                <div className="admin-stat-icon">{stat.icon}</div>
              </div>

              <h2>{stat.value}</h2>

              <p className="admin-stat-change">
                <FaArrowUp /> {stat.change}
                <span> compared to last month</span>
              </p>
            </div>
          ))}
        </section>

        <section className="admin-content-grid">
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
              {[45, 70, 50, 85, 60, 95, 75].map((height, index) => (
                <div className="admin-chart-column" key={index}>
                  <div
                    className="admin-chart-bar"
                    style={{ height: `${height}%` }}
                    title={`${height}%`}
                  />
                  <span>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </span>
                </div>
              ))}
            </div>

            <p className="admin-chart-note">
              <FaChartLine /> Sales activity throughout the week
            </p>
          </div>

          <div className="admin-panel admin-quick-panel">
            <h2>Quick Overview</h2>
            <p className="admin-panel-description">
              Manage your store quickly.
            </p>

            <button
              type="button"
              className="admin-quick-item"
              onClick={() => alert("User Management page will be added next.")}
            >
              <FaUsers />
              <span>Manage Users</span>
              <span className="admin-quick-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-quick-item"
              onClick={() => alert("Product Management page will be added next.")}
            >
              <FaBox />
              <span>Manage Products</span>
              <span className="admin-quick-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-quick-item"
              onClick={() => alert("Order Management page will be added next.")}
            >
              <FaShoppingBag />
              <span>Manage Orders</span>
              <span className="admin-quick-arrow">→</span>
            </button>
          </div>
        </section>

        <section className="admin-panel admin-orders-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest orders placed in your store</p>
            </div>

            <button
              type="button"
              className="admin-view-all"
              onClick={() => alert("Order Management page will be added next.")}
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
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span
                        className={`admin-status admin-status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="admin-footer">
          © 2026 MYAPP Admin Panel
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
