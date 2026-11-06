
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

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");
  const [addingId, setAddingId] = useState("");

  // GET WISHLIST FROM BACKEND
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load wishlist");
        }

        return data;
      })
      .then((data) => {
        const products = data.wishlist?.products || [];
        setWishlist(products);
      })
      .catch((error) => {
        console.log("Wishlist API error:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // REMOVE FROM WISHLIST
  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setRemovingId(productId);

      const response = await fetch(
        `http://localhost:5000/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to remove product");
      }

      setWishlist((previous) =>
        previous.filter((product) => product._id !== productId)
      );

      console.log("Remove Wishlist:", data.message);
    } catch (error) {
      console.log("Remove wishlist error:", error);
      alert(error.message);
    } finally {
      setRemovingId("");
    }
  };

  // ADD TO CART AND REMOVE FROM WISHLIST
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingId(product._id);

      // ADD PRODUCT TO CART
      const cartResponse = await fetch(
        "http://localhost:5000/cart/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: 1,
          }),
        }
      );

      const cartData = await cartResponse.json();

      if (!cartResponse.ok || !cartData.success) {
        throw new Error(cartData.message || "Unable to add product to cart");
      }

      // REMOVE PRODUCT FROM WISHLIST
      const wishlistResponse = await fetch(
        `http://localhost:5000/wishlist/remove/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const wishlistData = await wishlistResponse.json();

      if (!wishlistResponse.ok || !wishlistData.success) {
        throw new Error(
          wishlistData.message || "Product added to cart but wishlist removal failed"
        );
      }

      setWishlist((previous) =>
        previous.filter((item) => item._id !== product._id)
      );

      navigate("/cart");
    } catch (error) {
      console.log("Add to cart error:", error);
      alert(error.message);
    } finally {
      setAddingId("");
    }
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

      {loading ? (
        <div className="wishlist-empty">
          <p>Loading wishlist...</p>
        </div>
      ) : error ? (
        <div className="wishlist-empty">
          <p>{error}</p>

          <button
            className="wishlist-shop-button"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      ) : wishlist.length === 0 ? (
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
            <div className="wishlist-card" key={product._id}>
              <button
                className="wishlist-remove-button"
                onClick={() => removeFromWishlist(product._id)}
                disabled={removingId === product._id}
                title="Remove from wishlist"
              >
                {removingId === product._id ? (
                  "..."
                ) : (
                  <FaTrashAlt />
                )}
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="wishlist-image"
                onClick={() =>
                  navigate(`/product/${product._id}`, {
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
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </h4>

                <button
                  className="wishlist-add-cart"
                  onClick={() => addToCart(product)}
                  disabled={addingId === product._id}
                >
                  <FaShoppingCart />
                  {addingId === product._id
                    ? "Adding..."
                    : "Add to Cart"}
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
