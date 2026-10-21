
import "./review.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrash,
  FaShoppingBag,
  FaArrowRight
} from "react-icons/fa";

function OrderReview() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: (item.quantity || 1) + change
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const removeProduct = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="review-page">
        <button
          className="review-back"
          onClick={() => navigate("/cart")}
        >
          <FaArrowLeft /> Back to Cart
        </button>

        <div className="review-empty">
          <FaShoppingBag className="empty-icon" />
          <h2>Your order is empty</h2>
          <p>Add products to your cart before reviewing your order.</p>
          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <button
        className="review-back"
        onClick={() => navigate("/cart")}
      >
        <FaArrowLeft /> Back to Cart
      </button>

      <div className="review-container">
        <div className="review-heading">
          <span>ORDER SUMMARY</span>
          <h1>Review Your Order</h1>
          <p>Check your products before proceeding to checkout.</p>
        </div>

        <div className="review-layout">
          <div className="review-products">
            {cart.map((item) => (
              <div className="review-product" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="review-product-info">
                  <h3>{item.name}</h3>
                  <p className="review-price">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={(item.quantity || 1) <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity || 1}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="review-product-actions">
                  <strong>
                    ₹{(
                      Number(item.price) * (item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="review-remove"
                    onClick={() => removeProduct(item.id)}
                    aria-label="Remove product"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="review-summary">
            <h2>Price Details</h2>

            <div className="summary-row">
              <span>Items ({cart.reduce(
                (sum, item) => sum + (item.quantity || 1), 0
              )})</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free-delivery">FREE</span>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <span>₹0</span>
            </div>

            <div className="summary-total">
              <span>Total Amount</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="review-page"
              onClick={proceedToCheckout}
            >
              Proceed to Checkout <FaArrowRight />
            </button>

            <p className="review-note">
              Please verify your order before continuing.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderReview;
