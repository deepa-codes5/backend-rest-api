
import "./cart.css";
import { FaTrashAlt, FaArrowLeft, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const removeItem = (indexToRemove) => {
    setCart((previousCart) =>
      previousCart.filter((_, index) => index !== indexToRemove)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (total, product) => total + product.price,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <h2>YOUR CART ({cart.length})</h2>

          <button
            className="continue-shopping"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>

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

                {cart.map((product, index) => (
                  <div
                    className="cart-item"
                    key={`${product.id}-${index}`}
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
                        ₹{product.price.toLocaleString("en-IN")}
                      </h4>
                    </div>

                    <button
                      className="remove-cart-item"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove ${product.name}`}
                      title="Remove product"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
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
      </div>
    </div>
  );
}

export default Cart;
