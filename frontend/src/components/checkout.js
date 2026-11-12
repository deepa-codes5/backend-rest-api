
import "./checkout.css";
import { useEffect, useState, useCallback } from "react";
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

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const token = localStorage.getItem("token");

  // FETCH CART FROM BACKEND
  const fetchCart = useCallback(async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("CHECKOUT API DATA:", data);
      console.log("CHECKOUT ITEMS:", data.cart?.items);

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch cart");
      }

      setCart(data.cart?.items || []);
      setError("");

    } catch (err) {
      console.log("Checkout error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // UPDATE QUANTITY
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      setUpdatingProductId(productId);

      const response = await fetch("http://localhost:5000/cart/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update quantity");
      }

      await fetchCart();

    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingProductId("");
    }
  };

  // REMOVE PRODUCT
  const removeItem = async (productId) => {
    try {
      setUpdatingProductId(productId);

      const response = await fetch(
        `http://localhost:5000/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove product");
      }

      await fetchCart();

    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingProductId("");
    }
  };

  // SUBTOTAL
  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.product?.price || 0) *
      Number(item.quantity || 1);
  }, 0);

  // SHIPPING
  const shippingCharge =
    subtotal === 0 || subtotal >= 1000 ? 0 : 50;

  // DISCOUNT
  const discount = couponApplied ? subtotal * 0.1 : 0;

  // TOTAL
  const total = Math.max(
    0,
    subtotal + shippingCharge - discount
  );

  // ITEM COUNT
  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  // COUPON
  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === "WELCOME10") {
      setCouponApplied(true);
      setCouponMessage("10% discount applied successfully!");
    } else {
      setCouponApplied(false);
      setCouponMessage("Invalid coupon. Try WELCOME10.");
    }
  };

  // CONTINUE TO PAYMENT
  const continueToPayment = () => {
    if (cart.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    localStorage.setItem(
      "checkoutSummary",
      JSON.stringify({
        subtotal,
        shipping: shippingCharge,
        discount,
        total,
      })
    );

    navigate("/payment-method");
  };

  // LOADING
  if (loading) {
    return (
      <div className="checkout-page">
        <p>Loading your checkout...</p>
      </div>
    );
  }

  // EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <button
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

      {error && (
        <p style={{ color: "#f87171" }}>{error}</p>
      )}

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

            {cart.map((item) => {
              const product = item.product;

              if (!product) return null;

              return (
                <div className="checkout-product" key={product._id}>

                  <div className="checkout-product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <span>{product.name?.charAt(0) || "P"}</span>
                    )}
                  </div>

                  <div className="checkout-product-info">
                    <h3>{product.name}</h3>

                    <p className="checkout-unit-price">
                      ₹{Number(product.price).toFixed(2)} each
                    </p>

                    <div className="checkout-quantity">

                      <button
                        disabled={
                          Number(item.quantity) <= 1 ||
                          updatingProductId === product._id
                        }
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            Number(item.quantity) - 1
                          )
                        }
                      >
                        <FaMinus />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        disabled={updatingProductId === product._id}
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            Number(item.quantity) + 1
                          )
                        }
                      >
                        <FaPlus />
                      </button>

                      <button
                        className="checkout-remove"
                        disabled={updatingProductId === product._id}
                        onClick={() => removeItem(product._id)}
                      >
                        <FaTrashAlt />
                      </button>

                    </div>
                  </div>

                  <strong className="checkout-item-total">
                    ₹{(
                      Number(product.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </strong>

                </div>
              );
            })}

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

              <button onClick={applyCoupon}>Apply</button>
            </div>

            {couponMessage && (
              <p className={
                couponApplied
                  ? "checkout-coupon-success"
                  : "checkout-coupon-error"
              }>
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
            className="checkout-continue-btn"
            onClick={continueToPayment}
            disabled={updatingProductId !== ""}
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
