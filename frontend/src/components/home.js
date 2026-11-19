
import "./home.css";
import {
  FaUserCircle,
  FaSearch,
  FaHeart,
  FaBell,
  FaShoppingCart,
  FaArrowRight,
  FaCheckCircle,
  FaBoxOpen,
  FaShieldAlt,
  FaStar,
  FaTruck,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [cartCount, setCartCount] = useState(0);
  const [addingProductId, setAddingProductId] = useState("");

  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to MyApp!",
      message: "Explore our products and enjoy your shopping experience.",
      time: "Just now",
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  };

  // GET STUDENT DETAILS
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/studentRoute", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch student data");
        }
        return data;
      })
      .then((data) => setStudent(data.students))
      .catch((error) => console.log("Student API error:", error))
      .finally(() => setLoading(false));
  }, []);

  // GET PRODUCTS
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }
        return data;
      })
      .then((data) => setProducts(data.products || []))
      .catch((error) => setProductError(error.message))
      .finally(() => setProductLoading(false));
  }, []);

  // GET CART
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch cart");
        return data;
      })
      .then((data) => {
        const items = data.cart?.items || [];
        setCartCount(
          items.reduce((total, item) => total + Number(item.quantity || 1), 0)
        );
      })
      .catch((error) => console.log("Cart API error:", error));
  }, []);

  // GET WISHLIST
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch wishlist");
        }
        return data;
      })
      .then((data) => {
        const items = data.wishlist?.products || [];
        const ids = items.map((item) =>
          typeof item === "string" ? item : item._id
        );
        setWishlist(ids.filter(Boolean));
      })
      .catch((error) => console.log("Wishlist API error:", error));
  }, []);

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

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
            body: JSON.stringify({ productId: product._id }),
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
    } catch (error) {
      console.log("Wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // NAVIGATION
  const openCart = () => navigate("/cart");
  const openWishlist = () => navigate("/wishlist");
  const openProfile = () => navigate("/profile");

  const scrollToProducts = () => {
    document.querySelector("#products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const openAbout = () => {
    document.querySelector(".about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const openProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <header className="navbar">
        <div
          className="logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          MyApp<span>.</span>
        </div>

        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search your favourite products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <nav className="nav-links">
          <span onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </span>
          <span onClick={scrollToProducts}>Products</span>
          <span onClick={openAbout}>About</span>

          <span onClick={openCart} className="nav-action">
            <FaShoppingCart />
            <span>Cart ({cartCount})</span>
          </span>

          <span onClick={openWishlist} className="nav-action">
            <FaHeart />
            <span>Wishlist ({wishlist.length})</span>
          </span>

          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={() => setNotificationOpen((previous) => !previous)}
              title="Notifications"
              aria-label="Open notifications"
              aria-expanded={notificationOpen}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>

            {notificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}>Mark all read</button>
                  )}
                </div>

                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      className="notification-item"
                      key={item.id}
                      onClick={() =>
                        setNotifications((previous) =>
                          previous.map((notification) =>
                            notification.id === item.id
                              ? { ...notification, read: true }
                              : notification
                          )
                        )
                      }
                    >
                      <div className="notification-icon">
                        <FaBoxOpen />
                      </div>
                      <div className="notification-content">
                        <p><strong>{item.title}</strong></p>
                        <p>{item.message}</p>
                        <small>{item.time}</small>
                      </div>
                      {!item.read && <span className="unread-dot" />}
                    </div>
                  ))
                ) : (
                  <div className="notification-empty">
                    <FaCheckCircle />
                    <p>No notifications available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="profile-button" onClick={openProfile} title="My Profile">
            <FaUserCircle />
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero redesigned-hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span />
            YOUR EVERYDAY SHOPPING DESTINATION
          </div>

          <h1>
            {student?.name ? `Hello, ${student.name}!` : "Everything You Need"}
            <br />
            <span>All in One Place.</span>
          </h1>

          <p>
            Discover amazing products, explore your favourites and enjoy a
            simple, secure and smooth shopping experience.
          </p>

          <div className="hero-buttons">
            <button onClick={scrollToProducts}>
              Explore Products <FaArrowRight />
            </button>
            <button className="hero-secondary-button" onClick={openWishlist}>
              <FaHeart /> My Wishlist
            </button>
          </div>

          <div className="hero-trust">
            <span><FaCheckCircle /> Easy Shopping</span>
            <span><FaShieldAlt /> Secure Experience</span>
            <span><FaTruck /> Convenient Orders</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-glow" />
          <div className="hero-visual-card">
            <div className="visual-card-top">
              <span className="visual-dot" />
              <span>MYAPP COLLECTION</span>
            </div>
            <div className="visual-icon-grid">
              <div className="visual-icon visual-icon-one"><FaShoppingCart /></div>
              <div className="visual-icon visual-icon-two"><FaHeart /></div>
              <div className="visual-icon visual-icon-three"><FaStar /></div>
              <div className="visual-icon visual-icon-four"><FaBoxOpen /></div>
            </div>
            <h2>Find Your<br /><span>Favourite Things.</span></h2>
            <p>A better way to shop, all in one place.</p>
            <div className="visual-card-bottom">
              <span>Discover more</span>
              <FaArrowRight />
            </div>
          </div>
          <div className="floating-badge floating-badge-one">
            <FaHeart /> Your favourites
          </div>
          <div className="floating-badge floating-badge-two">
            <FaShoppingCart /> Easy checkout
          </div>
        </div>
      </section>

      {/* WELCOME / STATS */}
      <section className="dashboard-summary">
        <div className="summary-heading">
          <p className="section-label">YOUR SHOPPING SPACE</p>
          <h2>
            {loading
              ? "Welcome!"
              : student?.name
                ? `Welcome back, ${student.name}`
                : "Welcome to MyApp"}
          </h2>
          <p>Everything you need, just a click away.</p>
        </div>

        <div className="summary-cards">
          <button className="summary-card" onClick={openCart}>
            <span className="summary-icon cart-summary-icon"><FaShoppingCart /></span>
            <span className="summary-card-text">
              <strong>{cartCount}</strong>
              <small>Cart Items</small>
            </span>
            <FaArrowRight className="summary-arrow" />
          </button>

          <button className="summary-card" onClick={openWishlist}>
            <span className="summary-icon wishlist-summary-icon"><FaHeart /></span>
            <span className="summary-card-text">
              <strong>{wishlist.length}</strong>
              <small>Wishlist Items</small>
            </span>
            <FaArrowRight className="summary-arrow" />
          </button>

          <button className="summary-card" onClick={openProfile}>
            <span className="summary-icon profile-summary-icon"><FaUserCircle /></span>
            <span className="summary-card-text">
              <strong>My Account</strong>
              <small>View your profile</small>
            </span>
            <FaArrowRight className="summary-arrow" />
          </button>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="services" id="products">
        <div className="section-heading">
          <div>
            <p className="section-label">HANDPICKED FOR YOU</p>
            <h2>Explore Our <span>Products</span></h2>
            <p className="section-description">
              Find the perfect products for your everyday needs.
            </p>
          </div>
          <div className="product-total">
            {filteredProducts.length} Products
          </div>
        </div>

        <div className="product-toolbar">
          <div className="category-buttons">
            {["All", "Electronics", "Accessories", "Fashion"].map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category === "All" ? "All Products" : category}
              </button>
            ))}
          </div>

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
        </div>

        <div className="service-container">
          {productLoading ? (
            <div className="product-message">
              <FaBoxOpen />
              <h3>Loading products...</h3>
              <p>Please wait while we prepare the collection.</p>
            </div>
          ) : productError ? (
            <div className="product-message">
              <h3>Unable to load products</h3>
              <p>{productError}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product._id);

              return (
                <article className="service-card redesigned-product-card" key={product._id}>
                  <div className="product-image-wrapper">
                    <button
                      className={`wishlist-icon ${isWishlisted ? "active" : ""}`}
                      onClick={() => toggleWishlist(product)}
                      disabled={wishlistLoading}
                      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <FaHeart />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onClick={() => openProduct(product)}
                    />

                    <span className="product-category-tag">
                      {product.category}
                    </span>
                  </div>

                  <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h3 onClick={() => openProduct(product)}>{product.name}</h3>

                    <div className="product-bottom">
                      <div className="product-price-row">
                        <h4>₹{Number(product.price).toLocaleString("en-IN")}</h4>
                        <span className="product-stock-label">
                          {Number(product.stock) > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <button
                        className="product-button"
                        onClick={() => addToCart(product)}
                        disabled={
                          addingProductId === product._id ||
                          Number(product.stock) <= 0
                        }
                      >
                        {addingProductId === product._id
                          ? "Adding..."
                          : Number(product.stock) <= 0
                            ? "Out of Stock"
                            : <><FaShoppingCart /> Add to Cart</>}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="product-message">
              <FaSearch />
              <h3>No Products Found</h3>
              <p>Try another search or category.</p>
              <button
                className="reset-filter-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <div className="about-content">
          <div>
            <h3>MyApp.</h3>
            <p>Your one-stop shopping destination.</p>
          </div>
          <div>
            <h3>Get to Know Us</h3>
            <p>About MyApp</p>
            <p>Careers</p>
            <p>Press Releases</p>
          </div>
          <div>
            <h3>Connect with Us</h3>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>
          <div>
            <h3>Let Us Help You</h3>
            <p onClick={openProfile}>Your Account</p>
            <p onClick={openCart}>Your Cart</p>
            <p onClick={openWishlist}>Wishlist</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h3>MyApp.</h3>
          <p>Simple. Secure. Easy.</p>
        </div>

        <div className="footer-links">
          <span onClick={scrollToProducts}>Products</span>
          <span onClick={openCart}>Cart</span>
          <span onClick={openWishlist}>Wishlist</span>
          <span onClick={openProfile}>My Account</span>
        </div>

        <div>
          <p>© 2026 MyApp. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
