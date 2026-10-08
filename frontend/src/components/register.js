import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobilenumber, setMobilenumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (
            !name ||
            !email ||
            !mobilenumber ||
            !password ||
            !confirmPassword
        ) {
            toast.error("Please enter all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    mobileNumber: mobilenumber,
                    password: password
                })
            });

            const data = await response.json();

            console.log("Register response:", data);

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            toast.success("Registered successfully");

            setTimeout(() => {
                navigate("/otp", {
                    state: {
                        email: email
                    }
                });
            }, 1000);

        } catch (error) {
            console.log("Register error:", error);
            toast.error(error.message);
        }
    };

    return (
        <div className="register-container">

            <div className="register-box">

                <h1>Register</h1>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobilenumber}
                    onChange={(e) => setMobilenumber(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={handleRegister}>
                    Register
                </button>

                <ToastContainer />

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>

        </div>
    );
}

export default Register;