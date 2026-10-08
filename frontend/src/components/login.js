
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { toast, ToastContainer } from "react-toastify";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Please enter all fields");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            const token =
                data.token ||
                data.accessToken ||
                data.data?.token;

            if (!token) {
                throw new Error("Token not found in login response");
            }

            localStorage.setItem("token", token);

            toast.success("Login successful");

            setTimeout(() => {
                navigate("/home");
            }, 1000);

        } catch (error) {
            console.log("Login error:", error);
            toast.error(error.message);
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h1>Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleLogin}>
                    Login
                </button>

                <ToastContainer />

                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>

            </div>

        </div>
    );
}

export default Login;

