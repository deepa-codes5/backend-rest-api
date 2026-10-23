
import "./payment.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PaymentMethod() {
  const navigate = useNavigate();

  // Read cart from localStorage
  const [cart] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(savedCart) ? savedCart : [];
    } catch {
      return [];
    }
  });

  // Read checkout summary from localStorage
  const [summary] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("checkoutSummary")) || {}
      );
    } catch {
      return {};
    }
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  // Calculate subtotal from current cart items
  const subtotal = cart.reduce((sum, item) => {
    const price = Math.max(0, Number(item.price) || 0);
    const quantity = Math.max(
      1,
      Number(item.quantity) || 1
    );

    return sum + price * quantity;
  }, 0);

  // Read shipping and discount values
  const shipping = Math.max(
    0,
    Number(summary.shipping) || 0
  );

  const discount = Math.min(
    subtotal,
    Math.max(0, Number(summary.discount) || 0)
  );

  // Always calculate the final total
  const total = Math.max(
    0,
    subtotal + shipping - discount
  );

  // Format price in Indian currency format
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const handlePayment = (event) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError(
        "Your cart is empty. Please add products first."
      );
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setError(
        "Invalid order amount. Please check your checkout."
      );
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    // UPI validation
    if (paymentMethod === "UPI") {
      const upiPattern =
        /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]+$/;

      if (!upiId.trim()) {
        setError("Please enter your UPI ID.");
        return;
      }

      if (!upiPattern.test(upiId.trim())) {
        setError(
          "Please enter a valid UPI ID format."
        );
        return;
      }
    }

    // Card validation
    if (paymentMethod === "CARD") {
      if (!cardName.trim()) {
        setError(
          "Please enter the cardholder name."
        );
        return;
      }

      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        setError("Enter a 16-digit card number.");
        return;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        setError("Enter expiry in MM/YY format.");
        return;
      }

      const [month, year] = expiry.split("/").map(Number);
      const now = new Date();
      const expiryYear = 2000 + year;

      if (
        expiryYear < now.getFullYear() ||
        (expiryYear === now.getFullYear() &&
          month < now.getMonth() + 1)
      ) {
        setError("This card expiry date has passed.");
        return;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        setError("Enter a 3 or 4-digit CVV.");
        return;
      }
    }

    setProcessing(true);

    setTimeout(() => {
      const order = {
        orderId: `DEMO-${Date.now()}`,
        products: cart,
        items: cart,
        subtotal,
        shipping,
        discount,
        totalAmount: total,
        paymentMethod,
        paymentStatus:
          paymentMethod === "COD"
            ? "Pending"
            : "Paid (Simulated)",
        orderStatus: "Placed",
        currentStep: 0,
        date: new Date().toLocaleDateString("en-IN"),
        createdAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(
          "lastPracticeOrder",
          JSON.stringify(order)
        );

        // Save order for order tracking
        const savedOrders = JSON.parse(
          localStorage.getItem("orders") || "[]"
        );

        const orders = Array.isArray(savedOrders)
          ? savedOrders
          : [];

        orders.push(order);

        localStorage.setItem(
          "orders",
          JSON.stringify(orders)
        );

        localStorage.setItem(
          "selectedPaymentMethod",
          paymentMethod
        );

        setResult(order);
      } catch {
        setError(
          "Unable to save the practice order."
        );
      }

      setProcessing(false);
    }, 900);
  };

  // Payment success screen
  if (result) {
    return (
      <div className="payment-page">
        <div className="payment-result">
          <div className="payment-result-icon">
            {result.paymentMethod === "COD" ? "📦" : "✓"}
          </div>

          <h1>
            {result.paymentMethod === "COD"
              ? "Order Placed!"
              : "Demo Payment Successful!"}
          </h1>

          <p>
            {result.paymentMethod === "COD"
              ? "Pay when your order arrives."
              : "This is a simulated payment. No money was charged."}
          </p>

          <p>
            Order ID: <strong>{result.orderId}</strong>
          </p>

          <p>
            Total: <strong>₹{formatPrice(result.totalAmount)}</strong>
          </p>

          <p>
            Payment status: {result.paymentStatus}
          </p>

          <button
            type="button"
            className="payment-primary-btn"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <button
        type="button"
        className="payment-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="payment-layout">
        <form
          className="payment-container"
          onSubmit={handlePayment}
        >
          <div className="payment-heading">
            <span className="payment-eyebrow">
              SECURE CHECKOUT DEMO
            </span>

            <h1>Payment Method</h1>

            <p>
              Choose how you would like to pay for your order.
            </p>
          </div>

          <div className="payment-options">
            <button
              type="button"
              className={`payment-option ${
                paymentMethod === "UPI" ? "selected" : ""
              }`}
              onClick={() => {
                setPaymentMethod("UPI");
                setError("");
              }}
            >
              <span className="payment-option-icon">↗</span>
              <span>
                <strong>UPI</strong>
                <small>Google Pay, PhonePe, etc.</small>
              </span>
              <span className="payment-radio">
                {paymentMethod === "UPI" ? "●" : "○"}
              </span>
            </button>

            <button
              type="button"
              className={`payment-option ${
                paymentMethod === "CARD" ? "selected" : ""
              }`}
              onClick={() => {
                setPaymentMethod("CARD");
                setError("");
              }}
            >
              <span className="payment-option-icon">▤</span>
              <span>
                <strong>Debit / Credit Card</strong>
                <small>Visa, Mastercard, etc.</small>
              </span>
              <span className="payment-radio">
                {paymentMethod === "CARD" ? "●" : "○"}
              </span>
            </button>

            <button
              type="button"
              className={`payment-option ${
                paymentMethod === "COD" ? "selected" : ""
              }`}
              onClick={() => {
                setPaymentMethod("COD");
                setError("");
              }}
            >
              <span className="payment-option-icon">₹</span>
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
              <span className="payment-radio">
                {paymentMethod === "COD" ? "●" : "○"}
              </span>
            </button>
          </div>

          {paymentMethod === "UPI" && (
            <div className="payment-form-fields">
              <label htmlFor="upiId">UPI ID</label>

              <input
                id="upiId"
                type="text"
                placeholder="yourname@bank"
                value={upiId}
                onChange={(event) =>
                  setUpiId(event.target.value)
                }
              />

              <small>
                Demo validation only. No UPI transaction will occur.
              </small>
            </div>
          )}

          {paymentMethod === "CARD" && (
            <div className="payment-form-fields">
              <label htmlFor="cardName">
                Cardholder Name
              </label>

              <input
                id="cardName"
                type="text"
                placeholder="Name on card"
                value={cardName}
                onChange={(event) =>
                  setCardName(event.target.value)
                }
              />

              <label htmlFor="cardNumber">
                Card Number
              </label>

              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                maxLength={16}
                placeholder="16-digit demo number"
                value={cardNumber}
                onChange={(event) =>
                  setCardNumber(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16)
                  )
                }
              />

              <div className="payment-card-row">
                <div>
                  <label htmlFor="expiry">
                    Expiry (MM/YY)
                  </label>

                  <input
                    id="expiry"
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(event) => {
                      let value = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);

                      if (value.length > 2) {
                        value =
                          value.slice(0, 2) +
                          "/" +
                          value.slice(2);
                      }

                      setExpiry(value);
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="cvv">CVV</label>

                  <input
                    id="cvv"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="•••"
                    value={cvv}
                    onChange={(event) =>
                      setCvv(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4)
                      )
                    }
                  />
                </div>
              </div>

              <small>
                Use dummy details only. Never enter real card details.
              </small>
            </div>
          )}

          {paymentMethod === "COD" && (
            <div className="payment-cod-note">
              <strong>Cash on Delivery selected</strong>
              <p>
                No online payment is needed. Payment remains pending
                until the order is delivered and cash is collected.
              </p>
            </div>
          )}

          {error && (
            <p className="payment-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="payment-primary-btn"
            disabled={processing || cart.length === 0}
          >
            {processing
              ? "Processing demo..."
              : paymentMethod === "COD"
                ? "Place Order"
                : `Pay ₹${formatPrice(total)}`}
          </button>

          <p className="payment-demo-note">
            Practice mode only · No real payment is processed
          </p>
        </form>

        <aside className="payment-summary">
          <h2>Order Summary</h2>

          {cart.map((item, index) => {
            const price = Math.max(
              0,
              Number(item.price) || 0
            );

            const quantity = Math.max(
              1,
              Number(item.quantity) || 1
            );

            return (
              <div
                className="payment-summary-item"
                key={item.id ?? item._id ?? index}
              >
                <div>
                  <strong>
                    {item.name || item.productName || "Product"}
                  </strong>

                  <small>
                    ₹{formatPrice(price)} × {quantity}
                  </small>
                </div>

                <span>
                  ₹{formatPrice(price * quantity)}
                </span>
              </div>
            );
          })}

          <div className="payment-summary-row">
            <span>Subtotal</span>
            <span>₹{formatPrice(subtotal)}</span>
          </div>

          <div className="payment-summary-row">
            <span>Shipping</span>
            <span>₹{formatPrice(shipping)}</span>
          </div>

          <div className="payment-summary-row">
            <span>Discount</span>
            <span>-₹{formatPrice(discount)}</span>
          </div>

          <div className="payment-summary-total">
            <strong>Total</strong>
            <strong>₹{formatPrice(total)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PaymentMethod;
