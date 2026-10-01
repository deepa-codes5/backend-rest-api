
import { useState } from "react";
import "./otpverification.css";
import { toast, ToastContainer } from "react-toastify";

function OTPVerification() {


  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

 
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

        <button onClick={()=>{
          if(!email || !otp){
            toast.error("please enter the empty filed")
            return
          }
          toast.success("otp send to email")
        }}>
          Verify OTP
        </button>
        <ToastContainer/>

        <p className="resend-text">
          Didn't receive OTP? <span>Resend OTP</span>
        </p>

      </div>

    </div>
  );
}

export default OTPVerification;
