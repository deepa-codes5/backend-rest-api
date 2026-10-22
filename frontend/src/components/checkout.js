
import "./checkout.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaTrashAlt,
  FaLock,
  FaArrowRight,
  FaShoppingBag,
} from "react-icons/fa";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));
      if (!Array.isArray(saved)) return [];

      return saved.map((item) => ({
        ...item,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));
    } catch {
      return [];
    }
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Math.max(0, Number(item.price) || 0) * item.quantity,
    0
  );

  const shippingCharge =
    subtotal === 0 || subtotal >= 1000 ? 0 : 50;

  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal + shippingCharge - discount);

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const updateQuantity = (index, change) => {
    setCart((previous) =>
      previous.map((item, i) =>
        i === index
          ? {
            ...item,
            quantity: Math.max(1, item.quantity + change),
          }
          : item
      )
    );
  };

  const removeItem = (index) => {
    setCart((previous) => previous.filter((_, i) => i !== index));
  };

  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === "WELCOME10") {
      setCouponApplied(true);
      setCouponMessage("10% discount applied successfully!");
    } else {
      setCouponApplied(false);
      setCouponMessage("Invalid coupon. Try WELCOME10.");
    }
  };

  const continueToAddress = () => {
    if (cart.length === 0) return;

    localStorage.setItem(
      "checkoutSummary",
      JSON.stringify({
        subtotal,
        shipping: shippingCharge,
        discount,
        total,
      })
    );

    navigate("/shipping-address");
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <button
          type="button"
          className="checkout-back-btn"
          onClick={() => navigate("/home")}
        >
          <FaArrowLeft /> Home
        </button>

        <div className="checkout-empty">
          <FaShoppingBag size={42} />
          <h2>Your cart is empty</h2>
          <p>Add products before continuing to checkout.</p>

          <button
            type="button"
            className="checkout-primary-btn"
            onClick={() => navigate("/home")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button
        type="button"
        className="checkout-back-btn"
        onClick={() => navigate("/order-review")}
      >
        <FaArrowLeft /> Back to Order Review
      </button>

      <div className="checkout-heading">
        <span className="checkout-eyebrow">SECURE CHECKOUT</span>
        <h1>Checkout</h1>
        <p>Review your order total before continuing.</p>

        <div className="checkout-progress">
          <span>Cart</span>
          <span className="progress-line" />
          <span>Review</span>
          <span className="progress-line" />
          <strong>Checkout</strong>
        </div>
      </div>

      <div className="checkout-layout">
        <section className="checkout-summary-card">
          <div className="checkout-card-heading">
            <div>
              <h2>Order Summary</h2>
              <p>{itemCount} items in your cart</p>
            </div>

            <FaShoppingBag className="checkout-bag-icon" />
          </div>

          <div className="checkout-products">
            {cart.map((item, index) => (
              <div
                className="checkout-product"
                key={item.id ?? index}
              >
                <div className="checkout-product-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || item.title || "Product"}
                    />
                  ) : (
                    <span>
                      {(item.name || item.title || "P").charAt(0)}
                    </span>
                  )}
                </div>

                <div className="checkout-product-info">
                  <h3>{item.name || item.title || "Product"}</h3>

                  <p className="checkout-unit-price">
                    ₹{(Number(item.price) || 0).toFixed(2)} each
                  </p>

                  <div className="checkout-quantity">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(index, -1)}
                    >
                      <FaMinus />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(index, 1)}
                    >
                      <FaPlus />
                    </button>

                    <button
                      type="button"
                      className="checkout-remove"
                      aria-label="Remove product"
                      onClick={() => removeItem(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>

                <strong className="checkout-item-total">
                  ₹
                  {(
                    (Number(item.price) || 0) * item.quantity
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-coupon">
            <label htmlFor="coupon">Discount Code</label>

            <div className="checkout-coupon-row">
              <input
                id="coupon"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponApplied(false);
                  setCouponMessage("");
                }}
                placeholder="Enter coupon code"
              />

              <button type="button" onClick={applyCoupon}>
                Apply
              </button>
            </div>

            {couponMessage && (
              <p
                className={
                  couponApplied
                    ? "checkout-coupon-success"
                    : "checkout-coupon-error"
                }
              >
                {couponMessage}
              </p>
            )}

            <small>Try WELCOME10 for 10% off.</small>
          </div>

          <div className="checkout-price-details">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div>
              <span>Shipping</span>
              <span className={shippingCharge === 0 ? "checkout-free" : ""}>
                {shippingCharge === 0
                  ? "FREE"
                  : `₹${shippingCharge.toFixed(2)}`}
              </span>
            </div>

            <div>
              <span>Discount</span>
              <span className="checkout-discount">
                −₹{discount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            className="checkout-continue-btn"
            onClick={() => navigate("/payment-method")}
          >
            Continue to PaymentMethod <FaArrowRight />
          </button>

          <p className="checkout-secure-note">
            <FaLock /> Demo checkout · No real payment
          </p>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
