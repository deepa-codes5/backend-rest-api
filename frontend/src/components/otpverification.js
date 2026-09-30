
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./otpverification.css";

function OTPVerification() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        })
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("OTP verified successfully");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="otp-container">

      <div className="otp-box">

        <h1>Verify OTP</h1>

        <p>Enter the OTP sent to your email</p>

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          value={otp}
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerifyOTP}>
          Verify OTP
        </button>

        <p className="resend-text">
          Didn't receive OTP? <span>Resend OTP</span>
        </p>

      </div>

    </div>
  );
}

export default OTPVerification;
