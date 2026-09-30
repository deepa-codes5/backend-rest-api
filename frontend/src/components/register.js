import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {

    // Password check
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const userData = {
        name: name,
        email: email,
        mobileNumber: mobilenumber,
        password: password
      };

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {

        alert("Registration successful. OTP sent to your email.");

        // Register success → OTP page
        navigate("/otp");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

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

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;