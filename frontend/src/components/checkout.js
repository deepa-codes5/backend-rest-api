import "./checkout.css";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();
    return (
        <div className="checkout-page">
            <button
                className="home-button"
                onClick={() => navigate("/home")}
            >
                ← Home
            </button>
            <div className="checkout-container">


                <header className="checkout-header">
                    <div className="checkout-brand">
                        <h1>My App</h1>

                    </div>

                    <div className="checkout-steps">
                        <span>✓ Cart</span>
                        <span>✓ Review</span>
                        <span className="active-step">③ Checkout</span>
                    </div>
                </header>

                <div className="checkout-content">


                    <div className="checkout-form">

                        <section>
                            <h3>Shipping Address</h3>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" placeholder="Enter First Name" />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" placeholder="Enter Last Name" />
                                </div>

                                <div className="form-group">
                                    <label>E-mail</label>
                                    <input type="email" placeholder="Enter your Email" />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" placeholder="+91  Enter Phone number" />
                                </div>

                                <div className="form-group">
                                    <label>City</label>
                                    <select defaultValue="">
                                        <option value="">Select</option>
                                        <option>Chennai</option>
                                        <option>Madurai</option>
                                        <option>Coimbatore</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>State</label>
                                    <select defaultValue="">
                                        <option value="">Select</option>
                                        <option>Tamil Nadu</option>
                                        <option>Kerala</option>
                                        <option>Karnataka</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    <input type="text" placeholder="Enter ZIP Code" />
                                </div>
                            </div>

                            <label className="save-address">
                                <input type="checkbox" />
                                Save this information for the next time
                            </label>
                        </section>

                        {/* Shipping Method */}
                        <section className="shipping-section">
                            <h3>Shipping Method</h3>

                            <div className="shipping-options">
                                <div className="shipping-option selected-shipping">
                                    <div>
                                        <strong>◉ Free Shipping</strong>
                                        <small>7-10 Days</small>
                                    </div>
                                    <strong>0$</strong>
                                </div>

                                <div className="shipping-option">
                                    <div>
                                        <strong>◯ Express Shipping</strong>
                                        <small>1-3 Days</small>
                                    </div>
                                    <strong>9$</strong>
                                </div>
                            </div>
                        </section>


                        <section className="payment-section">
                            <h3>Select Payment Option</h3>

                            <div className="payment-option paypal-option">
                                <span>◯ PayPal</span>
                                <strong className="paypal-logo">PayPal</strong>
                            </div>

                            <div className="credit-card-box">
                                <div className="credit-heading">
                                    <strong>🔵 Credit Card</strong>
                                    <span className="card-brands">
                                        <b>VISA</b> <b>🔴</b> <b>DISCOVER</b>
                                    </span>
                                </div>

                                <small className="card-description">
                                    Pay securely using your Visa, Master, Discover, or American Express
                                </small>

                                <div className="form-group card-number">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="1234 1234 1234 1234"
                                    />
                                </div>

                                <div className="card-details">
                                    <div className="form-group">
                                        <label>Name of Card</label>
                                        <input type="text" placeholder="Card Name" />
                                    </div>

                                    <div className="form-group">
                                        <label>Expire Date</label>
                                        <input type="text" placeholder="MM / YY" />
                                    </div>

                                    <div className="form-group">
                                        <label>CVV</label>
                                        <input type="text" placeholder="CVV" />
                                    </div>
                                </div>
                            </div>

                            <div className="payment-option cash-option">
                                <span>◯ Cash on delivery</span>
                                <span>💵</span>
                            </div>
                        </section>
                    </div>


                    <aside className="order-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-product">
                            <div className="product-placeholder">📱</div>
                            <div className="summary-product-info">
                                <p>Samsung Galaxy Ultra 12 + 512GB</p>
                                <small>Titanium Gray, Dual Sim</small>
                                <small>◉ 1</small>
                            </div>
                            <strong>$999.99</strong>
                        </div>

                        <div className="summary-product">
                            <div className="product-placeholder">🎧</div>
                            <div className="summary-product-info">
                                <p>Spigen Cryo Armor Case For Samsung</p>
                                <small>Galaxy S24 Ultra</small>
                                <small>◉ 1</small>
                            </div>
                            <strong>$99.99</strong>
                        </div>

                        <div className="coupon-box">
                            <span>▤ &nbsp; Welcome10</span>
                            <strong>Apply</strong>
                        </div>

                        <div className="price-details">
                            <div>
                                <span>Subtotal</span>
                                <strong>$1099.98</strong>
                            </div>

                            <div>
                                <span>Shipping</span>
                                <strong>$0</strong>
                            </div>

                            <div>
                                <span>Discount</span>
                                <strong>-$10</strong>
                            </div>
                        </div>

                        <div className="total-price">
                            <h3>Total</h3>
                            <h3>$1089.98</h3>
                        </div>

                        <button className="pay-button">
                            Pay $1089.98
                        </button>

                        <p className="secure-checkout">
                            🔒 Secure Checkout - SSL Encrypted
                        </p>
                    </aside>

                </div>
            </div>
        </div>
    );
}

export default Checkout;