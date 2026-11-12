
import "./tracking.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaMapMarkerAlt,
  FaShoppingBag
} from "react-icons/fa";

const trackingSteps = [
  {
    title: "Order Placed",
    description: "Your order has been placed successfully.",
    icon: FaShoppingBag
  },
  {
    title: "Confirmed",
    description: "Your order has been confirmed.",
    icon: FaCheckCircle
  },
  {
    title: "Shipped",
    description: "Your order is on its way.",
    icon: FaTruck
  },
  {
    title: "Out for Delivery",
    description: "Your order is out for delivery.",
    icon: FaBox
  },
  {
    title: "Delivered",
    description: "Your order has been delivered.",
    icon: FaMapMarkerAlt
  }
];

function getStatusStep(status) {
  const statusMap = {
    Placed: 0,
    Confirmed: 1,
    Shipped: 2,
    "Out for Delivery": 3,
    Delivered: 4
  };

  return statusMap[status] ?? 0;
}

function OrderTracking() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH ORDERS FROM BACKEND
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login to view your orders.");
        }

        const response = await fetch(
          "http://localhost:5000/orders/my-orders",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch orders."
          );
        }

        setOrders(data.orders || []);

        console.log("BACKEND MY ORDERS:", data.orders);

      } catch (err) {
        console.error("Order fetching error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="tracking-page">
      <button
        type="button"
        className="tracking-back"
        onClick={() => navigate("/home")}
      >
        <FaArrowLeft /> Back to Home
      </button>

      <div className="tracking-container">

        <div className="tracking-heading">
          <span className="tracking-label">MY ORDERS</span>
          <h1>Track Your Orders</h1>
          <p>Follow your orders' delivery journey.</p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="tracking-order-card">
            <h3>Loading your orders...</h3>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="tracking-order-card">
            <h3>Unable to load orders</h3>
            <p>{error}</p>

            <button
              type="button"
              className="tracking-back"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* NO ORDERS */}
        {!loading && !error && orders.length === 0 && (
          <div className="tracking-order-card">
            <h3>No orders found</h3>

            <p>
              Your orders will appear here after placing an order.
            </p>

            <button
              type="button"
              className="tracking-back"
              onClick={() => navigate("/home")}
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* ORDER LIST */}
        {!loading && !error && orders.map((order) => {

          const orderId = order._id;

          const orderStatus = order.orderStatus || "Placed";

          const currentStep = getStatusStep(orderStatus);

          const activeStep = trackingSteps[currentStep];

          const products = order.items || [];

          return (
            <div key={orderId}>

              {/* ORDER CARD */}
              <div className="tracking-order-card">

                <div className="tracking-order-top">
                  <div>
                    <span className="tracking-muted">
                      Order ID
                    </span>

                    <h3>{orderId}</h3>
                  </div>

                  <span className="tracking-status">
                    {orderStatus}
                  </span>
                </div>

                {/* PRODUCTS */}
                {products.map((item, index) => {

                  const quantity = Math.max(
                    1,
                    Number(item.quantity) || 1
                  );

                  return (
                    <div
                      className="tracking-product"
                      key={item._id || item.product || index}
                    >

                      <img
                        src={
                          item.image ||
                          "https://placehold.co/100x110/242424/f5f5f5?text=Product"
                        }
                        alt={item.name || "Product"}
                      />

                      <div className="tracking-product-info">

                        <h3>
                          {item.name || "Product"}
                        </h3>

                        <p>Quantity: {quantity}</p>

                        <strong>
                          ₹{formatPrice(
                            Number(item.price) * quantity
                          )}
                        </strong>

                      </div>
                    </div>
                  );
                })}

                {/* ORDER DETAILS */}
                <div className="tracking-order-details">

                  <div>
                    <span>Order Date</span>

                    <strong>
                      {formatDate(order.createdAt)}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Method</span>

                    <strong>
                      {order.paymentMethod || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Status</span>

                    <strong>
                      {order.paymentStatus || "Pending"}
                    </strong>
                  </div>

                  <div>
                    <span>Total Amount</span>

                    <strong>
                      ₹{formatPrice(order.totalAmount)}
                    </strong>
                  </div>

                </div>

              </div>

              {/* TRACKING PROGRESS */}
              <div className="tracking-progress-card">

                <div className="tracking-progress-heading">

                  <div>
                    <h2>Order Status</h2>

                    <p>
                      Track each step of your delivery.
                    </p>
                  </div>

                  <span className="tracking-step-count">
                    {orderStatus === "Cancelled"
                      ? "Cancelled"
                      : `${currentStep + 1} of ${trackingSteps.length}`}
                  </span>

                </div>

                {/* TIMELINE */}
                {orderStatus === "Cancelled" ? (

                  <div className="tracking-current-box">
                    <FaBox />

                    <div>
                      <strong>Order Cancelled</strong>
                      <p>This order has been cancelled.</p>
                    </div>
                  </div>

                ) : (

                  <div className="tracking-timeline">

                    {trackingSteps.map((step, index) => {

                      const StepIcon = step.icon;

                      const isCompleted = index <= currentStep;

                      const isCurrent = index === currentStep;

                      return (
                        <div
                          className={`tracking-step ${
                            isCompleted ? "completed" : ""
                          } ${
                            isCurrent ? "current" : ""
                          }`}
                          key={step.title}
                        >

                          <div className="tracking-step-icon">
                            <StepIcon />
                          </div>

                          <div className="tracking-step-content">

                            <span className="tracking-step-title">
                              {step.title}
                            </span>

                            <p>{step.description}</p>

                            {isCompleted && (
                              <span className="tracking-step-date">
                                {formatDate(order.updatedAt)}
                              </span>
                            )}

                            {isCurrent && (
                              <span className="tracking-current-label">
                                CURRENT STATUS
                              </span>
                            )}

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

                {/* CURRENT STATUS */}
                {orderStatus !== "Cancelled" && (

                  <div className="tracking-current-box">

                    <FaTruck />

                    <div>
                      <strong>{activeStep.title}</strong>

                      <p>{activeStep.description}</p>
                    </div>

                  </div>

                )}

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default OrderTracking;
