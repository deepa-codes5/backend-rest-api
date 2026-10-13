import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar,FaHeart, FaShoppingCart, FaArrowLeft,FaTruck, FaShieldAlt,FaMinus, FaPlus,} from "react-icons/fa";
import "./productdetails.css";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product?.image || ""
  );
  const [message, setMessage] = useState("");

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <p>Please select a product from the home page.</p>
        <button onClick={() => navigate("/home")}>
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : Array(5).fill(product.image);

  const description =
    product.description ||
    `Discover our ${product.name}. A great choice from our ${product.category} collection. Designed to be a useful addition to your everyday life.`;

  const addToCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existingProduct = savedCart.find(
        (item) => item.id === product.id
      );

      let updatedCart;

      if (existingProduct) {
        updatedCart = savedCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        updatedCart = [
          ...savedCart,
          { ...product, quantity },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setMessage("Product added to cart successfully!");
    } catch {
      setMessage("Unable to add this product to cart.");
    }
  };

  const toggleWishlist = () => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const alreadyAdded = savedWishlist.some(
        (item) => item.id === product.id
      );

      const updatedWishlist = alreadyAdded
        ? savedWishlist.filter((item) => item.id !== product.id)
        : [...savedWishlist, product];

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );

      setMessage(
        alreadyAdded
          ? "Removed from wishlist."
          : "Added to wishlist successfully!"
      );
    } catch {
      setMessage("Unable to update wishlist.");
    }
  };

  const buyNow = () => {
    addToCart();
    setMessage("Product saved to cart. Continue to checkout from your cart page.");
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <button
          className="back-home-btn"
          onClick={() => navigate("/home")}
        >
          <FaArrowLeft /> Back to Home
        </button>

        <div className="product-breadcrumb">
          <span onClick={() => navigate("/home")}>Home</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <strong>{product.name}</strong>
        </div>

        <div className="product-details-card">
         
          <div className="product-gallery">
            <div className="main-product-image">
              <img
                src={selectedImage || product.image}
                alt={product.name}
              />
            </div>

            <div className="product-thumbnail-list">
              {images.slice(0, 5).map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={`product-thumbnail ${
                    selectedImage === image ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          
          <div className="product-info">
            <p className="product-category-label">
              {product.category}
            </p>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <span className="rating-stars" aria-label="Five star rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </span>
              <span className="rating-text">Customer favorite</span>
            </div>

            <div className="product-price">
              <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
            </div>

            <p className="product-description">{description}</p>

            <div className="product-stock">
              <span className="stock-dot"></span>
              Available for purchase
            </div>

            <div className="product-divider"></div>

            <div className="quantity-section">
              <span className="quantity-label">Quantity</span>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FaMinus />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => current + 1)
                  }
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="product-action-buttons">
              <button
                type="button"
                className="add-cart-btn"
                onClick={addToCart}
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button
                type="button"
                className="wishlist-btn"
                onClick={toggleWishlist}
                aria-label="Add to wishlist"
              >
                <FaHeart />
              </button>
            </div>

            <button
              type="button"
              className="buy-now-btn"
              onClick={buyNow}
            >
              Buy Now
            </button>

            {message && (
              <p className="product-feedback" role="status">
                {message}
              </p>
            )}

            <div className="product-benefits">
              <div className="benefit-item">
                <FaTruck />
                <div>
                  <strong>Delivery information</strong>
                  <p>Delivery options depend on your location.</p>
                </div>
              </div>

              <div className="benefit-item">
                <FaShieldAlt />
                <div>
                  <strong>Secure shopping</strong>
                  <p>Shop with confidence and care.</p>
                </div>
              </div>
            </div>

            <div className="product-extra-details">
              <h3>Product Details</h3>
              <div>
                <span>Product</span>
                <span>{product.name}</span>
              </div>
              <div>
                <span>Category</span>
                <span>{product.category}</span>
              </div>
              <div>
                <span>Price</span>
                <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <section className="product-description-section">
          <h2>About this product</h2>
          <p>{description}</p>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;