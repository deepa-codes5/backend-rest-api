
import "./tracking.css";
import { useState,  } from "react";
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
    title: "Processing",
    description: "Your products are being prepared.",
    icon: FaBox
  },
  {
    title: "Shipped",
    description: "Your order is on its way.",
    icon: FaTruck
  },
  {
    title: "Delivered",
    description: "Your order has been delivered.",
    icon: FaMapMarkerAlt
  }
];


function getSavedOrders() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function OrderTracking() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(getSavedOrders);

  // Initialize tracking steps using a consistent order ID
  const [currentSteps, setCurrentSteps] = useState(() => {
    const savedSteps = {};

    getSavedOrders().forEach((order, index) => {
      const orderId =
        order.id || order.orderId || `ORD-${index + 1}`;

      const step = Number(order.currentStep);

      savedSteps[orderId] = Math.max(
        0,
        Math.min(
          trackingSteps.length - 1,
          Number.isFinite(step) ? step : 0
        )
      );
    });

    return savedSteps;
  });


  const updateStep = (orderId, newStep) => {
    const safeStep = Math.max(
      0,
      Math.min(trackingSteps.length - 1, newStep)
    );

    setCurrentSteps((previous) => ({
      ...previous,
      [orderId]: safeStep
    }));

    setOrders((previousOrders) => {
      const updatedOrders = previousOrders.map(
        (order, index) => {
          const savedOrderId =
            order.id ||
            order.orderId ||
            `ORD-${index + 1}`;

          if (savedOrderId === orderId) {
            return {
              ...order,
              currentStep: safeStep,
              orderStatus: trackingSteps[safeStep].title
            };
          }

          return order;
        }
      );

      try {
        localStorage.setItem(
          "orders",
          JSON.stringify(updatedOrders)
        );
      } catch (error) {
        console.error("Unable to save tracking status:", error);
      }

      return updatedOrders;
    });
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

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

        {orders.length === 0 ? (
          <div className="tracking-order-card">
            <h3>No orders found</h3>
            <p>
              Your confirmed orders will appear here.
            </p>

            <button
              type="button"
              className="tracking-back"
              onClick={() => navigate("/home")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          orders.map((order, orderIndex) => {
            const orderId =
              order.id ||
              order.orderId ||
              `ORD-${orderIndex + 1}`;

            const currentStep = Math.max(
              0,
              Math.min(
                trackingSteps.length - 1,
                currentSteps[orderId] ?? 0
              )
            );

            const activeStep = trackingSteps[currentStep];

            const products = Array.isArray(order.products)
              ? order.products
              : Array.isArray(order.items)
              ? order.items
              : Array.isArray(order.cart)
              ? order.cart
              : order.product
              ? [order.product]
              : order.productName
              ? [order]
              : [];

            const total =
              order.totalAmount ??
              order.total ??
              products.reduce((sum, product) => {
                const price = Number(product.price) || 0;
                const quantity = Math.max(
                  1,
                  Number(product.quantity) || 1
                );

                return sum + price * quantity;
              }, 0);

            return (
              <div key={orderId}>
                <div className="tracking-order-card">
                  <div className="tracking-order-top">
                    <div>
                      <span className="tracking-muted">
                        Order ID
                      </span>
                      <h3>{orderId}</h3>
                    </div>

                    <span className="tracking-status">
                      {activeStep.title}
                    </span>
                  </div>

                  {products.map((product, index) => {
                    const quantity = Math.max(
                      1,
                      Number(product.quantity) || 1
                    );

                    return (
                      <div
                        className="tracking-product"
                        key={
                          product._id ||
                          product.id ||
                          index
                        }
                      >
                        <img
                          src={
                            product.image ||
                            product.imageUrl ||
                            "https://placehold.co/100x110/242424/f5f5f5?text=Product"
                          }
                          alt={
                            product.name ||
                            product.productName ||
                            "Product"
                          }
                        />

                        <div className="tracking-product-info">
                          <h3>
                            {product.name ||
                              product.productName ||
                              "Product"}
                          </h3>

                          <p>Quantity: {quantity}</p>

                          <strong>
                            ₹
                            {formatPrice(
                              (Number(product.price) || 0) *
                                quantity
                            )}
                          </strong>
                        </div>
                      </div>
                    );
                  })}

                  <div className="tracking-order-details">
                    <div>
                      <span>Order Date</span>
                      <strong>
                        {order.date ||
                          order.orderDate ||
                          (order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString("en-IN")
                            : "Date not available")}
                      </strong>
                    </div>

                    <div>
                      <span>Expected Delivery</span>
                      <strong>
                        {order.expectedDelivery ||
                          "To be confirmed"}
                      </strong>
                    </div>

                    <div>
                      <span>Total Amount</span>
                      <strong>
                        ₹{formatPrice(total)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="tracking-progress-card">
                  <div className="tracking-progress-heading">
                    <div>
                      <h2>Order Status</h2>
                      <p>
                        Track each step of your delivery.
                      </p>
                    </div>

                    <span className="tracking-step-count">
                      {currentStep + 1} of{" "}
                      {trackingSteps.length}
                    </span>
                  </div>

                  <div className="tracking-timeline">
                    {trackingSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted =
                        index <= currentStep;
                      const isCurrent =
                        index === currentStep;

                      return (
                        <div
                          className={`tracking-step ${
                            isCompleted ? "completed" : ""
                          } ${
                            isCurrent ? "current" : ""
                          }`}
                          key={step.title}
                        >
                          <button
                            type="button"
                            className="tracking-step-icon"
                            onClick={() =>
                              updateStep(orderId, index)
                            }
                            aria-label={`Set status to ${step.title}`}
                          >
                            <StepIcon />
                          </button>

                          <div className="tracking-step-content">
                            <button
                              type="button"
                              className="tracking-step-title"
                              onClick={() =>
                                updateStep(orderId, index)
                              }
                            >
                              {step.title}
                            </button>

                            <p>{step.description}</p>

                            {isCompleted && (
                              <span className="tracking-step-date">
                                {order.date ||
                                  order.orderDate ||
                                  ""}
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

                  <div className="tracking-current-box">
                    <FaTruck />
                    <div>
                      <strong>{activeStep.title}</strong>
                      <p>{activeStep.description}</p>
                    </div>
                  </div>

                  <div className="tracking-demo-controls">
                    <p>
                      Practice: change this order's tracking status
                    </p>

                    <div className="tracking-demo-buttons">
                      <button
                        type="button"
                        disabled={currentStep === 0}
                        onClick={() =>
                          updateStep(
                            orderId,
                            currentStep - 1
                          )
                        }
                      >
                        Previous
                      </button>

                      <button
                        type="button"
                        disabled={
                          currentStep ===
                          trackingSteps.length - 1
                        }
                        onClick={() =>
                          updateStep(
                            orderId,
                            currentStep + 1
                          )
                        }
                      >
                        Next Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OrderTracking;
