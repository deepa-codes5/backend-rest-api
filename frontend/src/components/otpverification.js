import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./otpverification.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OTPVerification() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();

    const handleVerifyOTP = async () => {
        if (!email || !otp) {
            toast.error("Please enter email and OTP");
            return;
        }

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

            console.log("OTP response:", data);

            if (!response.ok) {
                throw new Error(data.message || "OTP verification failed");
            }

            toast.success(data.message || "OTP verified successfully");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.log("OTP error:", error);
            toast.error(error.message);
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

                <ToastContainer />

                <p className="resend-text">
                    Didn't receive OTP? <span>Resend OTP</span>
                </p>

            </div>

        </div>
    );
}

export default OTPVerification;