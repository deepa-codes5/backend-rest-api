
import "./cart.css";
import { FaTrashAlt, FaArrowLeft, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState("");

  const token = localStorage.getItem("token");


  const fetchCart = async () => {
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

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      setCart(data.cart?.items || []);
      setError("");
    } catch (err) {
      console.log("Get cart error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

 
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

      setCart(data.cart?.items || []);
    } catch (err) {
      console.log("Remove cart error:", err);
      setError(err.message);
    } finally {
      setUpdatingProductId("");
    }
  };


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

      setCart(data.cart?.items || []);
    } catch (err) {
      console.log("Update quantity error:", err);
      setError(err.message);
    } finally {
      setUpdatingProductId("");
    }
  };


  const clearCart = async () => {
    try {
      setLoading(true);

      await Promise.all(
        cart.map(async (item) => {
          const productId = item.product?._id;

          if (!productId) return;

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
            throw new Error(data.message || "Unable to clear cart");
          }
        })
      );

      setCart([]);
      setError("");
    } catch (err) {
      console.log("Clear cart error:", err);
      setError(err.message);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

 
  const totalQuantity = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );


  const subtotal = cart.reduce((total, item) => {
    const product = item.product;

    if (!product) return total;

    return total + Number(product.price) * Number(item.quantity || 1);
  }, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <h2>YOUR CART ({totalQuantity})</h2>

          <button
            className="continue-shopping"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>

        {error && (
          <p style={{ color: "#f87171", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading your cart...</p>
        ) : (
          <div className="cart-layout">

            <div className="cart-products">

              {cart.length > 0 ? (
                <>
                  <div className="clear-cart-row">
                    <button
                      className="clear-cart-button"
                      onClick={clearCart}
                    >
                      <FaTrashAlt /> Clear Cart
                    </button>
                  </div>

                  {cart.map((item) => {
                    const product = item.product;

                    if (!product) return null;

                    return (
                      <div
                        className="cart-item"
                        key={product._id}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="cart-item-image"
                        />

                        <div className="cart-item-details">
                          <h3>{product.name}</h3>
                          <p>{product.category}</p>

                          <h4>
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </h4>

                          <div className="quantity-controls">
                            <button
                              className="quantity-button"
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

                            <span className="quantity-value">
                              {item.quantity}
                            </span>

                            <button
                              className="quantity-button"
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
                              <br></br>
                          <p>
                            Item Total: ₹
                            {(
                              Number(product.price) *
                              Number(item.quantity)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <button
                          className="remove-cart-item"
                          onClick={() => removeItem(product._id)}
                          disabled={updatingProductId === product._id}
                          aria-label={`Remove ${product.name}`}
                          title="Remove product"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <h3>Your cart is empty</h3>
                  <p>Add products from the Home page.</p>
                  <button onClick={() => navigate("/home")}>
                    SHOP PRODUCTS
                  </button>
                </div>
              )}

            </div>

            <aside className="cart-summary">
              <h3>SUMMARY</h3>

              <div className="summary-row">
                <span>SUBTOTAL</span>
                <span>₹{subtotal.toLocaleString("en-IN")}.00</span>
              </div>

              <div className="summary-row">
                <span>DELIVERY CHARGE</span>
                <span className="free-label">FREE</span>
              </div>

              <div className="coupon-box">
                <FaTag />
                <input type="text" placeholder="Coupon code" />
                <button>APPLY</button>
              </div>

              <div className="summary-row total-row">
                <strong>TOTAL</strong>
                <strong>₹{subtotal.toLocaleString("en-IN")}.00</strong>
              </div>

              <button
                className="checkout-button"
                disabled={cart.length === 0}
                onClick={() => navigate("/order-review")}
              >
                REVIEW PAGE
              </button>

              <p className="checkout-note">
                Taxes and shipping calculated at checkout
              </p>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
