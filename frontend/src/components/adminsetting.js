
import "./adminsetting.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaShieldAlt,
  FaBell,
  FaArrowLeft,
  FaSave,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const API_URL = "http://localhost:5000/admin-settings";

function AdminSettings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobileNumber: ""
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderNotifications: true,
    paymentNotifications: true,
    stockAlerts: true
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const token = localStorage.getItem("token");

  // FETCH ADMIN SETTINGS
  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch settings");
      }

      const admin = data.admin;

      setProfile({
        name: admin.name || "",
        email: admin.email || "",
        mobileNumber: admin.mobileNumber || ""
      });

      setNotifications({
        emailNotifications:
          admin.notificationSettings?.emailNotifications ?? true,
        orderNotifications:
          admin.notificationSettings?.orderNotifications ?? true,
        paymentNotifications:
          admin.notificationSettings?.paymentNotifications ?? true,
        stockAlerts:
          admin.notificationSettings?.stockAlerts ?? true
      });

      setTwoFactorEnabled(admin.twoFactorEnabled || false);

    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      showMessage("Please login again", "error");
      return;
    }

    fetchSettings();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  // PROFILE INPUT
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // UPDATE PROFILE
  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      showMessage(data.message);
      await fetchSettings();

    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const changePassword = async (e) => {
    e.preventDefault();

    if (password.newPassword.length < 8) {
      showMessage("Password must contain at least 8 characters", "error");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      showMessage("New passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(password)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      showMessage(data.message);

    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE NOTIFICATIONS
  const updateNotifications = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(notifications)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Notification update failed");
      }

      showMessage(data.message);

    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE TWO FACTOR
  const updateTwoFactor = async (enabled) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/two-factor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ enabled })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Security update failed");
      }

      setTwoFactorEnabled(enabled);
      showMessage(data.message);

    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Admin Profile", icon: <FaUser /> },
    { id: "password", label: "Change Password", icon: <FaLock /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> }
  ];

  return (
    <div className="admin-settings-page">

      <div className="admin-settings-header">
        <button
          className="admin-settings-back"
          onClick={() => navigate("/admin-dashboard")}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div>
          <h1>Admin Settings</h1>
          <p>Manage your account, security and preferences</p>
        </div>
      </div>

      {message && (
        <div className={`admin-settings-message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="admin-settings-layout">

        <aside className="admin-settings-sidebar">
          <div className="admin-settings-user">
            <div className="admin-settings-avatar">
              <FaUser />
            </div>
            <h3>{profile.name || "Admin"}</h3>
            <span>Administrator</span>
          </div>

          <div className="admin-settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="admin-settings-content">

          {loading && (
            <p className="admin-settings-loading">Processing...</p>
          )}

          {/* ADMIN PROFILE */}
          {activeTab === "profile" && (
            <section>
              <div className="admin-settings-title">
                <h2>Admin Profile</h2>
                <p>Update your personal information</p>
              </div>

              <form onSubmit={updateProfile}>
                <div className="admin-settings-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="admin-settings-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="admin-settings-form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={profile.mobileNumber}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="admin-settings-save"
                  disabled={loading}
                >
                  <FaSave /> Save Profile
                </button>
              </form>
            </section>
          )}

          {/* CHANGE PASSWORD */}
          {activeTab === "password" && (
            <section>
              <div className="admin-settings-title">
                <h2>Change Password</h2>
                <p>Keep your admin account secure</p>
              </div>

              <form onSubmit={changePassword}>
                <div className="admin-settings-form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        currentPassword: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="admin-settings-form-group">
                  <label>New Password</label>
                  <div className="admin-settings-password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password.newPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          newPassword: e.target.value
                        })
                      }
                      minLength="8"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="admin-settings-form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        confirmPassword: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="admin-settings-save"
                  disabled={loading}
                >
                  <FaLock /> Update Password
                </button>
              </form>
            </section>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <section>
              <div className="admin-settings-title">
                <h2>Security Settings</h2>
                <p>Manage your account protection</p>
              </div>

              <div className="admin-settings-security-card">
                <div>
                  <h3>Two-Factor Authentication</h3>
                  <p>
                    Enable or disable the 2FA account setting.
                    Actual OTP verification must be implemented separately.
                  </p>
                </div>

                <label className="admin-settings-switch">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    disabled={loading}
                    onChange={(e) => updateTwoFactor(e.target.checked)}
                  />
                  <span></span>
                </label>
              </div>

              <div className="admin-settings-security-status">
                <FaShieldAlt />
                <div>
                  <strong>Account Security</strong>
                  <p>
                    2FA Setting: {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <section>
              <div className="admin-settings-title">
                <h2>Notification Preferences</h2>
                <p>Choose which notifications you want to receive</p>
              </div>

              {[
                {
                  key: "emailNotifications",
                  title: "Email Notifications",
                  description: "General email notification preference"
                },
                {
                  key: "orderNotifications",
                  title: "Order Notifications",
                  description: "Receive updates about customer orders"
                },
                {
                  key: "paymentNotifications",
                  title: "Payment Notifications",
                  description: "Receive payment-related notifications"
                },
                {
                  key: "stockAlerts",
                  title: "Stock Alerts",
                  description: "Get alerts when product stock changes"
                }
              ].map((item) => (
                <div className="admin-settings-notification" key={item.key}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <label className="admin-settings-switch">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked
                        })
                      }
                    />
                    <span></span>
                  </label>
                </div>
              ))}

              <button
                className="admin-settings-save"
                onClick={updateNotifications}
                disabled={loading}
              >
                <FaSave /> Save Preferences
              </button>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminSettings;
