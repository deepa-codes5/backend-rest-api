
import "./wishlist.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaTrashAlt,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";

function Wishlist() {
  const navigate = useNavigate();

 
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);


  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(
      (product) => product.id !== productId
    );

    setWishlist(updatedWishlist);
  };

 
  const addToCart = (product) => {
    let cart = [];

    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      cart = [];
    }

    const updatedCart = [...cart, product];

    localStorage.setItem("cart", JSON.stringify(updatedCart));

   
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== product.id
    );

    setWishlist(updatedWishlist);

    // Navigate to cart page
    navigate("/cart");
  };

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <button
          className="wishlist-back-button"
          onClick={() => navigate("/home")}
        >
          <FaArrowLeft /> Back to Home
        </button>

        <h1>
          <FaHeart className="wishlist-heading-heart" /> My Wishlist
        </h1>

        <p>{wishlist.length} saved products</p>
      </header>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <FaHeart className="wishlist-empty-heart" />

          <h2>Your Wishlist is Empty</h2>

          <p>
            You haven't saved any favourite products yet.
          </p>

          <button
            className="wishlist-shop-button"
            onClick={() => navigate("/home")}
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="wishlist-products">
          {wishlist.map((product) => (
            <div className="wishlist-card" key={product.id}>
              <button
                className="wishlist-remove-button"
                onClick={() => removeFromWishlist(product.id)}
                title="Remove from wishlist"
              >
                <FaTrashAlt />
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="wishlist-image"
                onClick={() =>
                  navigate(`/product/${product.id}`, {
                    state: { product },
                  })
                }
              />

              <div className="wishlist-details">
                <h3>{product.name}</h3>

                <p className="wishlist-category">
                  {product.category}
                </p>

                <h4>
                  ₹{product.price.toLocaleString("en-IN")}
                </h4>

                <button
                  className="wishlist-add-cart"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
