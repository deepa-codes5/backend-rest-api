
import { useState } from "react";
import { Link } from "react-router-dom";
import "./security.css";

function Security() {
    const [security, setSecurity] = useState({
        emailNotifications: true,
        twoFactor: false,
    });

    const [show2FA, setShow2FA] = useState(false);
    const [showDisable2FA, setShowDisable2FA] = useState(false);

    const handleToggle = (key) => {
        setSecurity({
            ...security,
            [key]: !security[key],
        });
    };

    return (
        <div className="setting-page">
            <div className="setting-header">
                <h1>settings</h1>
                <p>
                    Manage your account, security, MT5, connection and subscription
                </p>
            </div>

            <div className="setting-container">

                <Link to="/settings">
                    <button>personal information</button>
                </Link>

                <button>security</button>

                <button>subscription</button>

            </div>

            <div className="security-list">

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
                            handleToggle("emailNotifications")
                        }
                    >
                        <span className="toggle-knob"></span>
                    </button>

                </div>


                {/* 2FA */}

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

                                // ON → OFF
                                setShowDisable2FA(true);

                            } else {

                                // OFF → ON
                                setShow2FA(true);

                            }

                        }}
                    >
                        <span className="toggle-knob"></span>
                    </button>

                </div>


              

                <div className="security-row">

                    <div className="security-text">
                        <h3>Change Password</h3>
                        <p>Last changed 3 months ago</p>
                    </div>

                    <button
                        type="button"
                        className="change-btn"
                    >
                        Change
                    </button>

                </div>

            </div>


            {/* ENABLE 2FA POPUP */}

            {show2FA && (

                <div className="twofa-modal">

                    <div className="twofa-box">

                        <h2>Enable 2FA</h2>

                        <p>
                            Scan the QR code with your authenticator app
                            and enter the 6-digit code.
                        </p>

                        <div className="qr-section">

                            <div className="qr-placeholder">
                                QR CODE
                            </div>

                            <div className="secret-section">

                                <label>Secret Key</label>

                                <div className="secret-key">
                                    ABCD EFGH IJKL MNOP
                                </div>

                            </div>

                        </div>

                        <label className="code-label">
                            Authenticator Code
                        </label>

                        <div className="otp-boxes">

                            <input maxLength="1" />
                            <input maxLength="1" />
                            <input maxLength="1" />
                            <input maxLength="1" />
                            <input maxLength="1" />
                            <input maxLength="1" />

                        </div>

                        <div className="twofa-actions">

                            <button
                                className="cancel-btn"
                                onClick={() => setShow2FA(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="enable-btn"
                                onClick={() => {

                                    setSecurity({
                                        ...security,
                                        twoFactor: true,
                                    });

                                    setShow2FA(false);

                                }}
                            >
                                Enable 2FA
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* DISABLE 2FA POPUP */}

            {showDisable2FA && (

                <div className="twofa-modal">

                    <div className="twofa-box">

                        <h2>Disable 2FA</h2>

                        <p>
                            Enter your authenticator code to disable
                            two-factor authentication.
                        </p>

                        <div className="twofa-actions">

                            <button
                                className="cancel-btn"
                                onClick={() => setShowDisable2FA(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="disable-btn"
                                onClick={() => {

                                    setSecurity({
                                        ...security,
                                        twoFactor: false,
                                    });

                                    setShowDisable2FA(false);

                                }}
                            >
                                Disable 2FA
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Security;

