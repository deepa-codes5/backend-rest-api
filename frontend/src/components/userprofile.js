
import "./userprofile.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaHeart,
  FaShieldAlt,
  FaCog,
  FaHeadset,
  FaSignOutAlt,
  FaChevronRight,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

function UserProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => {
    try {
      return {
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        mobile: localStorage.getItem("userMobile") || "",
      };
    } catch {
      return { name: "", email: "", mobile: "" };
    }
  });

  const [formData, setFormData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState(() => {
    try {
      return localStorage.getItem("userAddress") || "";
    } catch {
      return "";
    }
  });
  const [addressInput, setAddressInput] = useState(address);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage("Name and email are required.");
      return;
    }

    try {
      const updatedProfile = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
      };

      localStorage.setItem("userName", updatedProfile.name);
      localStorage.setItem("userEmail", updatedProfile.email);
      localStorage.setItem("userMobile", updatedProfile.mobile);

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Unable to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setMessage("");
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (!addressInput.trim()) {
      return;
    }

    try {
      localStorage.setItem("userAddress", addressInput.trim());
      setAddress(addressInput.trim());
      setIsEditingAddress(false);
      setMessage("Address saved successfully!");
    } catch {
      setMessage("Unable to save address. Please try again.");
    }
  };

  const handleDeleteAddress = () => {
    try {
      localStorage.removeItem("userAddress");
      setAddress("");
      setAddressInput("");
      setIsEditingAddress(false);
      setMessage("Address removed.");
    } catch {
      setMessage("Unable to remove address.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const accountOptions = [
    {
      title: "My Orders",
      description: "View and track your orders",
      icon: <FaShoppingBag />,
      action: () => navigate("/order-tracking"),
    },
    {
      title: "My Wishlist",
      description: "Your saved favourite products",
      icon: <FaHeart />,
      action: () => navigate("/wishlist"),
    },
    {
      title: "Security",
      description: "Manage your account security",
      icon: <FaShieldAlt />,
      action: () => navigate("/security"),
    },
    {
      title: "Settings",
      description: "Manage your account settings",
      icon: <FaCog />,
      action: () => navigate("/settings"),
    },
    {
      title: "Help & Support",
      description: "Get help with your account",
      icon: <FaHeadset />,
      action: () => navigate("/support"),
    },
  ];

  return (
    <div className="userprofile-page">
      <header className="userprofile-topbar">
        <button
          type="button"
          className="userprofile-back"
          onClick={() => navigate("/home")}
        >
          <FaArrowLeft />
          Back to Home
        </button>

        <span className="userprofile-brand">MyApp</span>
      </header>

      <main className="userprofile-main">
        <div className="userprofile-title">
          <h1>My Account</h1>
          <p>Manage your profile and account preferences</p>
        </div>

        {message && (
          <div className="userprofile-message" role="status">
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Close message"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <section className="userprofile-card userprofile-personal">
          <div className="userprofile-personal-top">
            <div className="userprofile-avatar-wrap">
              <FaUserCircle className="userprofile-avatar" />
            </div>

            <div className="userprofile-intro">
              <span className="userprofile-eyebrow">
                PERSONAL ACCOUNT
              </span>
              <h2>{profile.name || "Welcome!"}</h2>
              <p>{profile.email || "Add your email address"}</p>
            </div>

            {!isEditing && (
              <button
                type="button"
                className="userprofile-edit-btn"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(true);
                  setMessage("");
                }}
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="userprofile-info-grid">
              <div className="userprofile-info-item">
                <span>Full Name</span>
                <strong>{profile.name || "Not provided"}</strong>
              </div>

              <div className="userprofile-info-item">
                <span>Email Address</span>
                <strong>{profile.email || "Not provided"}</strong>
              </div>

              <div className="userprofile-info-item">
                <span>Mobile Number</span>
                <strong>{profile.mobile || "Not provided"}</strong>
              </div>
            </div>
          ) : (
            <form className="userprofile-form" onSubmit={handleSave}>
              <div className="userprofile-form-grid">
                <div className="userprofile-field">
                  <label htmlFor="profile-name">Full Name</label>
                  <input
                    id="profile-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="userprofile-field">
                  <label htmlFor="profile-email">Email Address</label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="userprofile-field">
                  <label htmlFor="profile-mobile">Mobile Number</label>
                  <input
                    id="profile-mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>

              <div className="userprofile-actions">
                <button type="submit" className="userprofile-primary">
                  <FaSave /> Save Changes
                </button>

                <button
                  type="button"
                  className="userprofile-secondary"
                  onClick={handleCancel}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="userprofile-section">
          <h2>My Account</h2>
          <div className="userprofile-menu-grid">
            {accountOptions.map((option) => (
              <button
                type="button"
                className="userprofile-menu-card"
                key={option.title}
                onClick={option.action}
              >
                <span className="userprofile-menu-icon">
                  {option.icon}
                </span>

                <span className="userprofile-menu-text">
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>

                <FaChevronRight className="userprofile-chevron" />
              </button>
            ))}
          </div>
        </section>

        <section className="userprofile-section">
          <h2>My Address</h2>

          <div className="userprofile-card userprofile-address-card">
            <div className="userprofile-address-heading">
              <span className="userprofile-menu-icon">
                <FaMapMarkerAlt />
              </span>
              <div>
                <h3>Delivery Address</h3>
                <p>Manage your preferred delivery address</p>
              </div>
            </div>

            {!isEditingAddress ? (
              <>
                <p className="userprofile-address-text">
                  {address || "No address added yet."}
                </p>

                <div className="userprofile-address-actions">
                  <button
                    type="button"
                    className="userprofile-secondary"
                    onClick={() => {
                      setAddressInput(address);
                      setIsEditingAddress(true);
                      setMessage("");
                    }}
                  >
                    {address ? <FaEdit /> : <FaPlus />}
                    {address ? "Edit Address" : "Add Address"}
                  </button>

                  {address && (
                    <button
                      type="button"
                      className="userprofile-delete-btn"
                      onClick={handleDeleteAddress}
                    >
                      <FaTrash /> Remove
                    </button>
                  )}
                </div>
              </>
            ) : (
              <form
                className="userprofile-address-form"
                onSubmit={handleSaveAddress}
              >
                <label htmlFor="profile-address">
                  Full Delivery Address
                </label>

                <textarea
                  id="profile-address"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="Enter your house number, street, city, state and PIN code"
                  rows={4}
                  required
                />

                <div className="userprofile-address-actions">
                  <button
                    type="submit"
                    className="userprofile-primary"
                  >
                    <FaSave /> Save Address
                  </button>

                  <button
                    type="button"
                    className="userprofile-secondary"
                    onClick={() => {
                      setAddressInput(address);
                      setIsEditingAddress(false);
                    }}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <button
          type="button"
          className="userprofile-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
          <FaChevronRight />
        </button>
      </main>

      <footer className="userprofile-footer">
        <p>© 2026 MyApp. Simple. Secure. Easy.</p>
      </footer>
    </div>
  );
}

export default UserProfile;
