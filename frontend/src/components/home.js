
import "./home.css";
import { FaUserCircle, FaSearch, FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [cartCount, setCartCount] = useState(0);
  const [addingProductId, setAddingProductId] = useState("");

  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // GET STUDENT DETAILS
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/studentRoute", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch student data");
        }

        return data;
      })
      .then((data) => {
        setStudent(data.students);
      })
      .catch((error) => {
        console.log("Student API error:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // GET ALL PRODUCTS
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        return data;
      })
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((error) => {
        console.log("Product API error:", error);
        setProductError(error.message);
      })
      .finally(() => {
        setProductLoading(false);
      });
  }, []);

  // GET CART
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://localhost:5000/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch cart");
        }

        return data;
      })
      .then((data) => {
        const items = data.cart?.items || [];

        const count = items.reduce(
          (total, item) => total + Number(item.quantity || 1),
          0
        );

        setCartCount(count);
      })
      .catch((error) => {
        console.log("Cart API error:", error);
      });
  }, []);

  // GET WISHLIST FROM BACKEND
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://localhost:5000/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch wishlist");
        }

        return data;
      })
      .then((data) => {
        const products = data.wishlist?.products || [];

        const productIds = products.map((item) =>
          typeof item === "string" ? item : item._id
        );

        setWishlist(productIds.filter(Boolean));
      })
      .catch((error) => {
        console.log("Wishlist API error:", error);
      });
  }, []);

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ADD TO CART
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingProductId(product._id);

      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add product");
      }

      const items = data.cart?.items || [];

      const count = items.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.log("Add to cart error:", error);
    } finally {
      setAddingProductId("");
    }
  };

  // ADD / REMOVE WISHLIST
  const toggleWishlist = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const alreadyAdded = wishlist.includes(product._id);

    try {
      setWishlistLoading(true);

      const response = await fetch(
        alreadyAdded
          ? `http://localhost:5000/wishlist/remove/${product._id}`
          : "http://localhost:5000/wishlist/add",
        {
          method: alreadyAdded ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          ...(!alreadyAdded && {
            body: JSON.stringify({
              productId: product._id,
            }),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Wishlist operation failed");
      }

      setWishlist((previous) =>
        alreadyAdded
          ? previous.filter((id) => id !== product._id)
          : [...previous, product._id]
      );

      console.log("Wishlist:", data.message);
    } catch (error) {
      console.log("Wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // OPEN CART
  const openCart = () => {
    navigate("/cart");
  };

  // OPEN WISHLIST
  const openWishlist = () => {
    navigate("/wishlist");
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">MyApp</div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch />
        </div>

        <div className="nav-links">
          <span>Home</span>
          <span>About</span>
          <span>Products</span>

          <span
            onClick={openCart}
            style={{ cursor: "pointer" }}
          >
            Cart ({cartCount})
          </span>

          <span
            onClick={openWishlist}
            style={{ cursor: "pointer" }}
          >
            Wishlist ({wishlist.length})
          </span>

          <FaUserCircle
            className="profile-icon"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
            title="My Profile"
          />
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="small-text">WELCOME TO MYAPP</p>

          <h1>
            Everything You Need
            <br />
            In One Place
          </h1>

          <p>
            Discover products, explore offers
            and enjoy a simple shopping experience.
          </p>

          <button
            onClick={() =>
              document.querySelector(".services")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Shop Now
          </button>
        </div>
      </section>

      <section className="services">
        <h2>Our Products</h2>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Fashion">Fashion</option>
        </select>

        <div className="service-container">
          {productLoading ? (
            <p>Loading products...</p>
          ) : productError ? (
            <p>{productError}</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product._id);

              return (
                <div className="service-card" key={product._id}>
                  <button
                    className={`wishlist-icon ${
                      isWishlisted ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
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
                    <FaHeart />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onClick={() =>
                      navigate(`/product/${product._id}`, {
                        state: { product },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  />

                  <h3
                    onClick={() =>
                      navigate(`/product/${product._id}`, {
                        state: { product },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {product.name}
                  </h3>

                  <p>{product.category}</p>

                  <h4>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </h4>

                  <button
                    className="product-button"
                    onClick={() => addToCart(product)}
                    disabled={addingProductId === product._id}
                  >
                    {addingProductId === product._id
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>

      <section className="about">
        <div className="about-content">
          <div>
            <h3>Get to Know Us</h3>
            <p>About MyApp</p>
            <p>Careers</p>
            <p>Press Releases</p>
            <p>MyApp Science</p>
          </div>

          <div>
            <h3>Connect with Us</h3>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>

          <div>
            <h3>Make Money with Us</h3>
            <p>Sell on MyApp</p>
            <p>Become a Partner</p>
            <p>Advertise Your Products</p>
            <p>Affiliate Program</p>
            <p>Business Solutions</p>
          </div>

          <div>
            <h3>Let Us Help You</h3>
            <p>Your Account</p>
            <p>Returns</p>
            <p>Purchase Protection</p>
            <p>MyApp App Download</p>
            <p>Help</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <h3>MyApp</h3>
          <p>Simple. Secure. Easy.</p>
        </div>

        <div>
          <p>About</p>
          <p>Services</p>
          <p>Contact</p>
        </div>

        <div>
          <p>© 2026 MyApp</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
