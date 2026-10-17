
import "./checkout.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft,FaMinus,FaPlus, FaTrashAlt,FaLock,FaCheckCircle} from "react-icons/fa";

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

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Math.max(0, Number(item.price) || 0) * item.quantity,
    0
  );

  const shippingCharge =
    subtotal === 0 || subtotal >= 1000
      ? 0
      : shipping === "express"
      ? 99
      : 50;

  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal + shippingCharge - discount);

  const updateAddress = (event) => {
    const { name, value } = event.target;
    setAddress((previous) => ({ ...previous, [name]: value }));
  };

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

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    if (payment === "card") {
      if (
        !/^\d{16}$/.test(cardDetails.number.replace(/\s/g, "")) ||
        !cardDetails.name.trim() ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry) ||
        !/^\d{3,4}$/.test(cardDetails.cvv)
      ) {
        setError("Enter valid demo card details.");
        return;
      }
    }

    if (payment === "upi" &&
        !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      setError("Enter a valid UPI ID, for example name@bank.");
      return;
    }

    const orderDetails = {
      id: "ORD" + Date.now(),
      customer: `${address.firstName} ${address.lastName}`.trim(),
      items: cart.map((item) => ({ ...item })),
      subtotal,
      shipping: shippingCharge,
      discount,
      total,
      payment,
      address: { ...address },
      date: new Date().toLocaleDateString(),
    };

    // Demo only: no real payment or backend order creation.
    setOrder(orderDetails);
    localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
    setCart([]);
    localStorage.removeItem("cart");
  };

  if (order) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <FaCheckCircle className="success-icon" />
          <h1>Order Placed!</h1>
          <p>Thank you, {order.customer}.</p>
          <p>Your demo order number</p>
          <h3>{order.id}</h3>
          <div className="success-total">
            Order Total <strong>₹{order.total.toFixed(2)}</strong>
          </div>
          <p className="checkout-muted">
            Demo confirmation only. No payment was processed and
            the order has not been saved to a backend database.
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/home")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/home")}
        >
          <FaArrowLeft /> Home
        </button>
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add products to continue checkout.</p>
          <button
            type="button"
            className="primary-btn"
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
        className="back-btn"
        onClick={() => navigate("/cart")}
      >
        <FaArrowLeft /> Back to Cart
      </button>

      <div className="checkout-heading">
        <div>
          <h1>Checkout</h1>
          <p>Complete your order securely.</p>
        </div>

        <div className="checkout-steps">
          <span>Cart</span>
          <span className="step-line" />
          <span>Review</span>
          <span className="step-line" />
          <strong>3 Checkout</strong>
        </div>
      </div>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        {/* LEFT: ADDRESS, SHIPPING AND PAYMENT */}
        <div className="checkout-left">
          <section className="checkout-card">
            <div className="section-heading">
              <span className="section-number">1</span>
              <div>
                <h2>Shipping Address</h2>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <div className="checkout-fields">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={address.firstName}
                  onChange={updateAddress}
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={address.lastName}
                  onChange={updateAddress}
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={address.email}
                  onChange={updateAddress}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={address.phone}
                  onChange={updateAddress}
                  placeholder="10-digit number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="field full-field">
                <label htmlFor="street">Street Address</label>
                <textarea
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={updateAddress}
                  placeholder="House number, street, area"
                  rows={2}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={updateAddress}
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={updateAddress}
                  placeholder="State"
                  autoComplete="address-level1"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="pincode">ZIP / Pincode</label>
                <input
                  id="pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={updateAddress}
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>
          </section>

          <section className="checkout-card">
            <div className="section-heading">
              <span className="section-number">2</span>
              <div>
                <h2>Shipping Method</h2>
                <p>Choose your preferred delivery.</p>
              </div>
            </div>

            <div className="choice-grid">
              <label
                className={`choice-card ${
                  shipping === "standard" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shipping === "standard"}
                  onChange={() => setShipping("standard")}
                />
                <span>
                  <strong>Standard</strong>
                  <small>3–7 business days</small>
                </span>
                <b>{subtotal >= 1000 ? "FREE" : "₹50"}</b>
              </label>

              <label
                className={`choice-card ${
                  shipping === "express" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shipping === "express"}
                  onChange={() => setShipping("express")}
                />
                <span>
                  <strong>Express</strong>
                  <small>1–3 business days</small>
                </span>
                <b>{subtotal >= 1000 ? "FREE" : "₹99"}</b>
              </label>
            </div>

            <p className="checkout-muted">
              Free delivery on orders of ₹1,000 or more.
            </p>
          </section>

          <section className="checkout-card">
            <div className="section-heading">
              <span className="section-number">3</span>
              <div>
                <h2>Payment Method</h2>
                <p>Select how you want to pay.</p>
              </div>
            </div>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={payment === "upi"}
                  onChange={() => setPayment("upi")}
                />
                <span>UPI</span>
                <small>UPI ID</small>
              </label>

              {payment === "upi" && (
                <div className="payment-extra">
                  <label htmlFor="upiId">UPI ID</label>
                  <input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@bank"
                  />
                </div>
              )}

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                <span>Credit / Debit Card</span>
                <small>Card details</small>
              </label>

              {payment === "card" && (
                <div className="payment-extra">
                  <p className="checkout-muted">
                    Demo fields only. Never enter real card details here.
                  </p>

                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        number: e.target.value.replace(/\D/g, "").slice(0, 16),
                      }))
                    }
                    placeholder="16-digit demo number"
                  />

                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    id="cardName"
                    autoComplete="off"
                    value={cardDetails.name}
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Cardholder name"
                  />

                  <div className="card-fields-row">
                    <div className="field">
                      <label htmlFor="expiry">Expiry (MM/YY)</label>
                      <input
                        id="expiry"
                        autoComplete="off"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            expiry: e.target.value,
                          }))
                        }
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        id="cvv"
                        type="password"
                        autoComplete="off"
                        inputMode="numeric"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                          }))
                        }
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                </div>
              )}

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                <span>Cash on Delivery</span>
                <small>Pay when delivered</small>
              </label>
            </div>
          </section>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <aside className="checkout-card summary-card">
          <h2>Order Summary</h2>
          <p className="summary-caption">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
          </p>

          <div className="summary-products">
            {cart.map((item, index) => (
              <div className="summary-product" key={item.id ?? index}>
                <div className="product-placeholder">
                  {item.image ? (
                    <img src={item.image} alt={item.name || item.title || "Product"} />
                  ) : (
                    <span>{(item.name || item.title || "P").charAt(0)}</span>
                  )}
                </div>

                <div className="summary-product-info">
                  <h3>{item.name || item.title || "Product"}</h3>
                  <p>₹{(Number(item.price) || 0).toFixed(2)} each</p>

                  <div className="quantity-controls">
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
                      className="remove-item"
                      aria-label="Remove product"
                      onClick={() => removeItem(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>

                <strong className="summary-product-price">
                  ₹{((Number(item.price) || 0) * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="coupon-box">
            <label htmlFor="coupon">Discount Code</label>
            <div className="coupon-row">
              <input
                id="coupon"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponMessage("");
                  setCouponApplied(false);
                }}
                placeholder="Enter coupon code"
              />
              <button type="button" onClick={applyCoupon}>
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={couponApplied ? "coupon-success" : "coupon-error"}>
                {couponMessage}
              </p>
            )}
            <small>Try WELCOME10 for 10% off.</small>
          </div>

          <div className="summary-calculations">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge.toFixed(2)}`}</span>
            </div>
            <div>
              <span>Discount</span>
              <span className="discount-value">−₹{discount.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button type="submit" className="place-order-btn">
            PLACE ORDER · ₹{total.toFixed(2)}
          </button>

          <p className="secure-note">
            <FaLock /> Demo checkout · No real payment
          </p>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;
