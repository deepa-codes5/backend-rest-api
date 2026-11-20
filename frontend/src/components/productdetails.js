
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaTruck,
  FaShieldAlt,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

import { toast } from "react-toastify";
import "./productdetails.css";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // 1. GET PRODUCT DETAILS
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/products/${id}`
        );

        const data = await response.json();

        console.log("PRODUCT ID:", id);
        console.log("PRODUCT API RESPONSE:", data);

        if (!response.ok || !data.product) {
          throw new Error(
            data.message || "Failed to fetch product details"
          );
        }

        setProduct(data.product);
        setSelectedImage(data.product.image || "");
        setQuantity(1);

      } catch (err) {
        console.log("Product Details API Error:", err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 2. GET WISHLIST
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("WISHLIST RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch wishlist"
          );
        }

        const products =
          data.wishlist?.products ||
          data.wishlist?.items ||
          data.products ||
          (Array.isArray(data.wishlist) ? data.wishlist : []);

        const alreadyAdded = products.some((item) => {
          const productId =
            item.product?._id ||
            item.product ||
            item._id;

          return String(productId) === String(id);
        });

        setIsWishlisted(alreadyAdded);

      } catch (err) {
        console.log("Wishlist Fetch Error:", err);
      }
    };

    fetchWishlist();
  }, [id, token]);

  // 3. LOADING
  if (loading) {
    return (
      <div className="product-not-found">
        <h2>Loading product details...</h2>
      </div>
    );
  }

  // 4. PRODUCT NOT FOUND
  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>

        <p>
          {error || "Please select a product from Home."}
        </p>

        <button onClick={() => navigate("/home")}>
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    );
  }

  // 5. PRODUCT DATA
  const images =
    product.images?.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const description =
    product.description ||
    `Discover our ${product.name}. A great choice from our ${product.category} collection.`;

  const stock = Math.max(
    0,
    Number(product.stock) || 0
  );

  const price = Number(product.price) || 0;

  // 6. ADD TO CART
  const addToCart = async () => {
    if (!token) {
      toast.error("Please login to add products to cart.");
      navigate("/login");
      return false;
    }

    if (stock <= 0) {
      toast.error("Sorry, this product is out of stock.");
      return false;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items are available.`);
      return false;
    }

    try {
      setCartLoading(true);

      const response = await fetch(
        "http://localhost:5000/cart/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: product._id,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      console.log("ADD CART RESPONSE:", data);

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Unable to add product."
        );
      }

      toast.success("Product added to cart successfully!");

      return true;

    } catch (err) {
      console.log("Add to Cart Error:", err);

      toast.error(
        err.message || "Unable to add product to cart."
      );

      return false;

    } finally {
      setCartLoading(false);
    }
  };

  // 7. ADD / REMOVE WISHLIST
  const toggleWishlist = async () => {
    if (!token) {
      toast.error("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      const url = isWishlisted
        ? `http://localhost:5000/wishlist/remove/${product._id}`
        : "http://localhost:5000/wishlist/add";

      const response = await fetch(url, {
        method: isWishlisted ? "DELETE" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        ...(!isWishlisted && {
          body: JSON.stringify({
            productId: product._id,
          }),
        }),
      });

      const data = await response.json();

      console.log("WISHLIST UPDATE RESPONSE:", data);

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Wishlist update failed."
        );
      }

      setIsWishlisted(!isWishlisted);

      toast.success(
        isWishlisted
          ? "Removed from wishlist."
          : "Added to wishlist successfully!"
      );

    } catch (err) {
      console.log("Wishlist Error:", err);

      toast.error(
        err.message || "Unable to update wishlist."
      );

    } finally {
      setWishlistLoading(false);
    }
  };

  // 8. BUY NOW
  const buyNow = async () => {
    if (cartLoading) return;

    const success = await addToCart();

    if (success) {
      navigate("/cart");
    }
  };

  // 9. RENDER UI
  return (
    <div className="product-details-page">

      <div className="product-details-container">

        {/* BACK BUTTON */}
        <button
          className="back-home-btn"
          onClick={() => navigate("/home")}
        >
          <FaArrowLeft />
          Back to Home
        </button>

        {/* BREADCRUMB */}
        <div className="product-breadcrumb">

          <span onClick={() => navigate("/home")}>
            Home
          </span>

          <span>/</span>

          <span>{product.category}</span>

          <span>/</span>

          <strong>{product.name}</strong>

        </div>

        {/* PRODUCT CARD */}
        <div className="product-details-card">

          {/* PRODUCT GALLERY */}
          <div className="product-gallery">

            <div className="main-product-image">

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                />
              ) : (
                <p>Image not available</p>
              )}

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

          {/* PRODUCT INFORMATION */}
          <div className="product-info">

            <p className="product-category-label">
              {product.category}
            </p>

            <h1 className="product-title">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="product-rating">

              <span className="rating-stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </span>

              <span className="rating-text">
                Customer favorite
              </span>

            </div>

            {/* PRICE */}
            <div className="product-price">

              <span>
                ₹{price.toLocaleString("en-IN")}
              </span>

            </div>

            {/* DESCRIPTION */}
            <p className="product-description">
              {description}
            </p>

            {/* STOCK */}
            <div className="product-stock">

              <span
                className="stock-dot"
                style={{
                  background:
                    stock > 0 ? "#59c785" : "#ef5350",
                }}
              />

              {stock > 0
                ? `${stock} items available`
                : "Out of Stock"}

            </div>

            <div className="product-divider" />

            {/* QUANTITY */}
            <div className="quantity-section">

              <span className="quantity-label">
                Quantity
              </span>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
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
                    setQuantity((current) =>
                      Math.min(stock, current + 1)
                    )
                  }
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </button>

              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="product-action-buttons">

              {/* ADD TO CART */}
              <button
                type="button"
                className="add-cart-btn"
                onClick={addToCart}
                disabled={stock <= 0 || cartLoading}
              >

                <FaShoppingCart />

                {cartLoading
                  ? "Adding..."
                  : "Add to Cart"}

              </button>

              {/* WISHLIST */}
              <button
                type="button"
                className={`wishlist-btn ${
                  isWishlisted ? "wishlisted" : ""
                }`}
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                title={
                  isWishlisted
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >

                {isWishlisted
                  ? <FaHeart />
                  : <FaRegHeart />}

              </button>

            </div>

            {/* BUY NOW */}
            <button
              type="button"
              className="buy-now-btn"
              onClick={buyNow}
              disabled={stock <= 0 || cartLoading}
            >

              {cartLoading ? "Please wait..." : "Buy Now"}

            </button>

            {/* BENEFITS */}
            <div className="product-benefits">

              <div className="benefit-item">

                <FaTruck />

                <div>

                  <strong>
                    Delivery Information
                  </strong>

                  <p>
                    Delivery options depend on your location.
                  </p>

                </div>

              </div>

              <div className="benefit-item">

                <FaShieldAlt />

                <div>

                  <strong>
                    Secure Shopping
                  </strong>

                  <p>
                    Shop with confidence and care.
                  </p>

                </div>

              </div>

            </div>

            {/* EXTRA DETAILS */}
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
                <span>
                  ₹{price.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span>Available Stock</span>
                <span>{stock}</span>
              </div>

            </div>

          </div>

        </div>

        {/* PRODUCT DESCRIPTION */}
        <section className="product-description-section">

          <h2>About This Product</h2>

          <p>{description}</p>

        </section>

      </div>

    </div>
  );
}

export default ProductDetails;
