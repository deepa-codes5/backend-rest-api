import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import Home from "./components/home";
import OtpVerification from "./components/otpverification";
import Supportticket from "./components/supportticket";
import Settings from "./components/settings";
import Security from "./components/security";
import ProductDetails from "./components/productdetails";
import Cart from "./components/cart";
import Wishlist from "./components/wishlist";
import Checkout from "./components/checkout";
import OrderReview from "./components/review";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/support" element={<Supportticket />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/security" element={<Security />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-review" element={<OrderReview />} />
         <Route path="/checkout" element={<Checkout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
