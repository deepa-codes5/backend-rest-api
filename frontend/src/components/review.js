
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

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState("");

  const token = localStorage.getItem("token");

  // GET CART FROM BACKEND
  const fetchCart = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch cart");
      }

      setCart(data.cart?.items || []);
      setError("");

    } catch (err) {
      console.log("Review cart error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE QUANTITY
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      setUpdatingProductId(productId);

      const response = await fetch("http://localhost:5000/cart/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          quantity
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update quantity");
      }

      setCart(data.cart?.items || []);

    } catch (err) {
      console.log("Update quantity error:", err);
      setError(err.message);
    } finally {
      setUpdatingProductId("");
    }
  };

  // REMOVE PRODUCT
  const removeProduct = async (productId) => {
    try {
      setUpdatingProductId(productId);

      const response = await fetch(
        `http://localhost:5000/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove product");
      }

      setCart(data.cart?.items || []);

    } catch (err) {
      console.log("Remove product error:", err);
      setError(err.message);
    } finally {
      setUpdatingProductId("");
    }
  };

  // TOTAL QUANTITY
  const totalQuantity = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  // TOTAL PRICE
  const total = cart.reduce((sum, item) => {
    if (!item.product) return sum;

    return (
      sum +
      Number(item.product.price) * Number(item.quantity || 1)
    );
  }, 0);

  // PROCEED TO CHECKOUT
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    navigate("/checkout");
  };

  // LOADING
  if (loading) {
    return (
      <div className="review-page">
        <p>Loading your order...</p>
      </div>
    );
  }

  // EMPTY CART
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

          <button onClick={() => navigate("/home")}>
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

        {error && (
          <p style={{ color: "#f87171", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <div className="review-layout">

          <div className="review-products">

            {cart.map((item) => {
              const product = item.product;

              if (!product) return null;

              return (
                <div
                  className="review-product"
                  key={product._id}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div className="review-product-info">
                    <h3>{product.name}</h3>

                    <p className="review-price">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            Number(item.quantity) - 1
                          )
                        }
                        disabled={
                          Number(item.quantity) <= 1 ||
                          updatingProductId === product._id
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            Number(item.quantity) + 1
                          )
                        }
                        disabled={updatingProductId === product._id}
                      >
                        +
                      </button>

                    </div>
                  </div>

                  <div className="review-product-actions">

                    <strong>
                      ₹{(
                        Number(product.price) *
                        Number(item.quantity)
                      ).toLocaleString("en-IN")}
                    </strong>

                    <button
                      className="review-remove"
                      onClick={() => removeProduct(product._id)}
                      disabled={updatingProductId === product._id}
                      aria-label="Remove product"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </div>
              );
            })}

          </div>

          <aside className="review-summary">

            <h2>Price Details</h2>

            <div className="summary-row">
              <span>Items ({totalQuantity})</span>
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
              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
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
