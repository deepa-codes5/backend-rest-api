import { useState } from "react";
import { Link } from "react-router-dom";
import "./security.css"
function Security() {
    const [security, setSecurity] = useState({
        emailNotifications: true,
        twoFactor: true,
    });

    const handleToggle = (key) => {
        setSecurity({ ...security, [key]: !security[key] });
    };

    return (
        <div className="setting-page">
            <div className="setting-header">
                <h1>settings</h1>
                <p>Manage your account,security,MT5,connection and subscription</p>
            </div>
            <div className="setting-container">
                <Link to="/settings"><button>personal information</button></Link>
                <button>security</button>
                <button>subscription</button>
            </div>

            <div className="security-list">
                <div className="security-row">
                    <div className="security-text">
                        <h3>Email Notifications</h3>
                        <p>Receive important updates via email.</p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={security.emailNotifications}
                        className={`toggle ${security.emailNotifications ? "on" : ""}`}
                        onClick={() => handleToggle("emailNotifications")}
                    >
                        <span className="toggle-knob"></span>
                    </button>
                </div>

                <div className="security-row">
                    <div className="security-text">
                        <h3>Two-Factor Authentication (2FA)</h3>
                        <p>Add an extra layer of security to your account.</p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={security.twoFactor}
                        className={`toggle ${security.twoFactor ? "on" : ""}`}
                        onClick={() => handleToggle("twoFactor")}
                    >
                        <span className="toggle-knob"></span>
                    </button>
                </div>

                <div className="security-row">
                    <div className="security-text">
                        <h3>Change Password</h3>
                        <p>Last changed 3 months ago</p>
                    </div>
                    <button type="button" className="change-btn">
                        Change
                    </button>
                </div>
            </div>
        </div>

    )
}



export default Security
