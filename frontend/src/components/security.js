
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./security.css";

function Security() {
    const API_URL = "http://localhost:5000/studentRoute";

    const [security, setSecurity] = useState({
        emailNotifications: true,
        twoFactor: false,
    });

    const [show2FA, setShow2FA] = useState(false);
    const [showDisable2FA, setShowDisable2FA] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // GET SECURITY STATUS
    useEffect(() => {
        const getSecurity = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    toast.error("Please login again");
                    return;
                }

                const response = await fetch(`${API_URL}/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch security");
                }

                setSecurity((prev) => ({
                    ...prev,
                    twoFactor: data.student.twoFactorEnabled || false,
                }));

            } catch (error) {
                console.log("Security fetch error:", error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getSecurity();
    }, []);

    // ENABLE 2FA
    const handleEnable2FA = async () => {
        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/2fa/enable`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            console.log("ENABLE 2FA RESPONSE:", data);

            if (!response.ok) {
                throw new Error(data.message || "Enable 2FA failed");
            }

            setSecurity((prev) => ({
                ...prev,
                twoFactor: true,
            }));

            setShow2FA(false);
            toast.success("Two-Factor Authentication enabled!");

        } catch (error) {
            console.log("Enable 2FA error:", error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    // DISABLE 2FA
    const handleDisable2FA = async () => {
        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/2fa/disable`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            console.log("DISABLE 2FA RESPONSE:", data);

            if (!response.ok) {
                throw new Error(data.message || "Disable 2FA failed");
            }

            setSecurity((prev) => ({
                ...prev,
                twoFactor: false,
            }));

            setShowDisable2FA(false);
            toast.success("Two-Factor Authentication disabled!");

        } catch (error) {
            console.log("Disable 2FA error:", error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="setting-page">
                <h2>Loading security settings...</h2>
            </div>
        );
    }

    return (
        <div className="setting-page">

            <div className="setting-header">
                <h1>Settings</h1>

                <p>
                    Manage your account, security, MT5, connection and subscription
                </p>
            </div>

            <div className="setting-container">

                <Link to="/settings">
                    <button type="button">Personal Information</button>
                </Link>

                <button type="button">Security</button>

                <button type="button">Subscription</button>

            </div>

            <div className="security-list">

                {/* EMAIL NOTIFICATIONS */}
                <div className="security-row">

                    <div className="security-text">
                        <h3>Email Notifications</h3>

                        <p>
                            Receive important updates via email.
                        </p>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={security.emailNotifications}
                        className={`toggle ${
                            security.emailNotifications ? "on" : ""
                        }`}
                        onClick={() =>
                            setSecurity((prev) => ({
                                ...prev,
                                emailNotifications: !prev.emailNotifications,
                            }))
                        }
                    >
                        <span className="toggle-knob"></span>
                    </button>

                </div>

                {/* TWO FACTOR AUTHENTICATION */}
                <div className="security-row">

                    <div className="security-text">
                        <h3>Two-Factor Authentication (2FA)</h3>

                        <p>
                            Add an extra layer of security to your account.
                        </p>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={security.twoFactor}
                        className={`toggle ${
                            security.twoFactor ? "on" : ""
                        }`}
                        onClick={() => {
                            if (security.twoFactor) {
                                setShowDisable2FA(true);
                            } else {
                                setShow2FA(true);
                            }
                        }}
                    >
                        <span className="toggle-knob"></span>
                    </button>

                </div>

                {/* CHANGE PASSWORD */}
                <div className="security-row">

                    <div className="security-text">
                        <h3>Change Password</h3>

                        <p>
                            Update your account password.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="change-btn"
                        onClick={() =>
                            toast.info("Change Password integration is pending")
                        }
                    >
                        Change
                    </button>

                </div>

            </div>

            {/* ENABLE 2FA MODAL */}
            {show2FA && (
                <div className="twofa-modal">

                    <div className="twofa-box">

                        <h2>Enable 2FA</h2>

                        <p>
                            Are you sure you want to enable Two-Factor
                            Authentication for your account?
                        </p>

                        <div className="twofa-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShow2FA(false)}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="enable-btn"
                                onClick={handleEnable2FA}
                                disabled={saving}
                            >
                                {saving ? "Enabling..." : "Enable 2FA"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* DISABLE 2FA MODAL */}
            {showDisable2FA && (
                <div className="twofa-modal">

                    <div className="twofa-box">

                        <h2>Disable 2FA</h2>

                        <p>
                            Are you sure you want to disable
                            Two-Factor Authentication?
                        </p>

                        <div className="twofa-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowDisable2FA(false)}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="disable-btn"
                                onClick={handleDisable2FA}
                                disabled={saving}
                            >
                                {saving ? "Disabling..." : "Disable 2FA"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Security;
