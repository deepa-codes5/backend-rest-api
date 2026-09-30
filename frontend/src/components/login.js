
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

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

      console.log(data);

      if (response.ok) {

        // JWT token save
        localStorage.setItem("token", data.token);

        alert("Login successful");

        // Go to Home page
        navigate("/home");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

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

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;

