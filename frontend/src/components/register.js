import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Welcome from "./example";


function Register() {
  const [name, setName] = useState("deepa");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

        <button onClick={()=> {
          if (!name|| !email|| !mobilenumber||!password|| !confirmPassword){
              toast.error("please enter the empty field")
              return;
          }
              toast.success("Registered successfully")
        }}>
          Register
        </button>
        <ToastContainer />

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
          <Welcome/>
      </div>

    </div>
  );
}

export default Register;