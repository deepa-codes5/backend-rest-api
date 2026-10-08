
import { Link } from "react-router-dom";
import "./setting.css";
import { useState, useEffect } from "react";

function Settings() {

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
    });

    // GET USER DETAILS
    useEffect(() => {

        const getUser = async () => {
            try {

                const token = localStorage.getItem("token");

                const response = await fetch("http://localhost:5000/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();

                console.log("USER DATA:", data);

                if (response.ok) {
                    setForm({
                        fullName: data.student.name,
                        email: data.student.email,
                        phone: data.student.mobileNumber,
                        country: ""
                    });
                }

            } catch (error) {
                console.log("Failed to get user:", error);
            }
        };

        getUser();

    }, []);


    // INPUT CHANGE
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    // UPDATE USER DETAILS
    const handleSave = async (e) => {
        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/me", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.fullName,
                    email: form.email,
                    mobileNumber: form.phone
                })
            });

            const data = await response.json();

            console.log("UPDATE RESPONSE:", data);

            if (response.ok) {
                alert("Profile updated successfully");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Update failed:", error);
        }
    };


    return (
        <div className="setting-page">

            <div className="setting-header">
                <h1>settings</h1>

                <p>
                    Manage your account,security,MT5,connection and subscription
                </p>
            </div>


            <div className="setting-container">

                <button>personal infromation</button>

                <Link to="/security">
                    <button>security</button>
                </Link>

                <button>subscription</button>

            </div>


            <div className="personal-information">

                <h2>Personal Information</h2>

                <p className="card-desc">
                    This information is used across your RKG MATRIX account.
                </p>


                <form
                    className="info-form"
                    onSubmit={handleSave}
                >

                    <div className="form-group">

                        <label htmlFor="fullName">
                            Full Name
                        </label>

                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.fullName}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="phone">
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={form.phone}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="country">
                            Country
                        </label>

                        <select
                            id="country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select your country
                            </option>

                            <option value="IN">
                                India
                            </option>

                            <option value="US">
                                United States
                            </option>

                            <option value="UK">
                                United Kingdom
                            </option>

                            <option value="AE">
                                United Arab Emirates
                            </option>

                        </select>

                    </div>


                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Save Changes
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Settings;

