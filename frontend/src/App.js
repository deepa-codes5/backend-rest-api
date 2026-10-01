import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import Home from "./components/home";
import OtpVerification from "./components/otpverification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/otp" element={<OtpVerification />} />
        
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
