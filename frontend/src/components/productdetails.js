
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaTruck,
  FaShieldAlt,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import "./productdetails.css";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(
    location.state?.product || null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    location.state?.product?.image || ""
  );
  const [message, setMessage] = useState("");

  // 1. Get Product Details From Backend
  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch product details"
          );
        }

        return data;
      })
      .then((data) => {
        setProduct(data.product);
        setSelectedImage(data.product.image || "");
      })
      .catch((error) => {
        console.log("Product Details API Error:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 2. Loading
  if (loading) {
    return (
      <div className="product-not-found">
        <h2>Loading product details...</h2>
      </div>
    );
  }

  // 3. Product Not Found
  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <p>{error || "Please select a product from the home page."}</p>

        <button onClick={() => navigate("/home")}>
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    );
  }

  // 4. Product Images
  const images =
    product.images?.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  // 5. Product Description
  const description =
    product.description ||
    `Discover our ${product.name}. A great choice from our ${product.category} collection. Designed to be a useful addition to your everyday life.`;

  const stock = Number(product.stock) || 0;

  // 6. Add to Cart
  const addToCart = () => {
    try {
      if (stock <= 0) {
        setMessage("Sorry, this product is out of stock.");
        return;
      }

      if (quantity > stock) {
        setMessage(`Only ${stock} items are available.`);
        return;
      }

      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existingProduct = savedCart.find(
        (item) => item._id === product._id
      );

      let updatedCart;

      if (existingProduct) {
        const newQuantity =
          (Number(existingProduct.quantity) || 1) + quantity;

        if (newQuantity > stock) {
          setMessage(`Only ${stock} items are available.`);
          return;
        }

        updatedCart = savedCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: newQuantity }
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
    } catch (error) {
      console.log(error);
      setMessage("Unable to add this product to cart.");
    }
  };

  // 7. Wishlist
  const toggleWishlist = () => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const alreadyAdded = savedWishlist.some(
        (item) => item._id === product._id
      );

      const updatedWishlist = alreadyAdded
        ? savedWishlist.filter(
            (item) => item._id !== product._id
          )
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
    } catch (error) {
      console.log(error);
      setMessage("Unable to update wishlist.");
    }
  };

  // 8. Buy Now
  const buyNow = () => {
    if (stock <= 0 || quantity > stock) {
      setMessage(
        stock <= 0
          ? "Sorry, this product is out of stock."
          : `Only ${stock} items are available.`
      );
      return;
    }

    addToCart();
    navigate("/cart");
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

            <h1 className="product-title">
              {product.name}
            </h1>

            <div className="product-rating">
              <span className="rating-stars" aria-label="Five star rating">
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

            <div className="product-price">
              <span>
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            <p className="product-description">
              {description}
            </p>

            <div className="product-stock">
              <span className="stock-dot"></span>
              {stock > 0
                ? `${stock} items available`
                : "Out of Stock"}
            </div>

            <div className="product-divider"></div>

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

            <div className="product-action-buttons">
              <button
                type="button"
                className="add-cart-btn"
                onClick={addToCart}
                disabled={stock <= 0}
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
              disabled={stock <= 0}
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
                  <p>
                    Delivery options depend on your location.
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <FaShieldAlt />
                <div>
                  <strong>Secure shopping</strong>
                  <p>
                    Shop with confidence and care.
                  </p>
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
                <span>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span>Available Stock</span>
                <span>{stock}</span>
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
