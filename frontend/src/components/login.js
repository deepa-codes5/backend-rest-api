
import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { toast, ToastContainer } from "react-toastify";

function Login() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

        <button onClick={()=>{
          if(!email || !password){
            toast.error("please enter the empty field")
          }
          toast.success("login succesfully")
        }}>
          Login
        </button>
        <ToastContainer/>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;

