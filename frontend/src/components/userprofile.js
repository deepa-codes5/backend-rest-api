
import "./userprofile.css";
import { useState, useEffect } from "react";
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

import { toast } from "react-toastify";

function UserProfile() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/studentRoute/me";

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [address, setAddress] = useState("");
  const [addressInput, setAddressInput] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET PROFILE FROM BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
            return;
          }

          throw new Error(data.message || "Unable to fetch profile");
        }

        const student = data.student;

        const userProfile = {
          name: student.name || "",
          email: student.email || "",
          mobile: student.mobileNumber || "",
        };

        setProfile(userProfile);
        setFormData(userProfile);

        setAddress(student.address || "");
        setAddressInput(student.address || "");

      } catch (error) {
        toast.error(error.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // FORM INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE PROFILE
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (
      formData.mobile.trim() &&
      !/^[0-9]{10}$/.test(formData.mobile.trim())
    ) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobileNumber: formData.mobile.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      const student = data.student;

      const updatedProfile = {
        name: student.name || "",
        email: student.email || "",
        mobile: student.mobileNumber || "",
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);

      toast.success("Profile updated successfully!");

    } catch (error) {
      toast.error(error.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // CANCEL PROFILE EDIT
  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // SAVE ADDRESS
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!addressInput.trim()) {
      toast.error("Please enter your address.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: addressInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Address update failed");
      }

      const updatedAddress = data.student.address || "";

      setAddress(updatedAddress);
      setAddressInput(updatedAddress);
      setIsEditingAddress(false);

      toast.success("Address saved successfully!");

    } catch (error) {
      toast.error(error.message || "Unable to save address.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE ADDRESS
  const handleDeleteAddress = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Address removal failed");
      }

      setAddress("");
      setAddressInput("");
      setIsEditingAddress(false);

      toast.success("Address removed successfully!");

    } catch (error) {
      toast.error(error.message || "Unable to remove address.");
    } finally {
      setSaving(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // ACCOUNT OPTIONS
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

  // LOADING
  if (loading) {
    return (
      <div className="userprofile-page">
        <main className="userprofile-main">
          <p>Loading your profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="userprofile-page">

      {/* TOP BAR */}
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

        {/* PAGE TITLE */}
        <div className="userprofile-title">
          <h1>My Account</h1>
          <p>Manage your profile and account preferences</p>
        </div>

        {/* PERSONAL PROFILE */}
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
                }}
              >
                <FaEdit /> Edit Profile
              </button>
            )}

          </div>

          {/* PROFILE VIEW */}
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

            /* PROFILE EDIT FORM */
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
                    disabled
                    readOnly
                  />
                </div>

                <div className="userprofile-field">
                  <label htmlFor="profile-mobile">Mobile Number</label>

                  <input
                    id="profile-mobile"
                    name="mobile"
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                  />
                </div>

              </div>

              <div className="userprofile-actions">

                <button
                  type="submit"
                  className="userprofile-primary"
                  disabled={saving}
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="userprofile-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FaTimes /> Cancel
                </button>

              </div>

            </form>
          )}

        </section>

        {/* ACCOUNT OPTIONS */}
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

        {/* ADDRESS SECTION */}
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
                      disabled={saving}
                    >
                      <FaTrash /> Remove
                    </button>
                  )}

                </div>

              </>
            ) : (

              /* ADDRESS EDIT FORM */
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
                    disabled={saving}
                  >
                    <FaSave />
                    {saving ? "Saving..." : "Save Address"}
                  </button>

                  <button
                    type="button"
                    className="userprofile-secondary"
                    onClick={() => {
                      setAddressInput(address);
                      setIsEditingAddress(false);
                    }}
                    disabled={saving}
                  >
                    <FaTimes /> Cancel
                  </button>

                </div>

              </form>
            )}

          </div>

        </section>

        {/* LOGOUT */}
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

      {/* FOOTER */}
      <footer className="userprofile-footer">
        <p>© 2026 MyApp. Simple. Secure. Easy.</p>
      </footer>

    </div>
  );
}

export default UserProfile;
