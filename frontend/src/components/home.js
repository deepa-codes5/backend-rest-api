
import "./home.css";
import { FaUserCircle, FaSearch, FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  
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
          throw new Error(
            data.message || "Failed to fetch student data"
          );
        }

        return data;
      })
      .then((data) => {
        setStudent(data.students);
      })
      .catch((error) => {
        console.log("API error:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1500,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2500,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      id: 3,
      name: "Casual Shoes",
      price: 1800,
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: 4,
      name: "Backpack",
      price: 1200,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    },
  ];

 
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

 
  const addToCart = (product) => {
    const updatedCart = [...cart, product];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

 
  const toggleWishlist = (product) => {
    const alreadyAdded = wishlist.some(
      (item) => item.id === product.id
    );

    const updatedWishlist = alreadyAdded
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updatedWishlist);
    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

 
  const openCart = () => {
    navigate("/cart");
  };

  
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
            Cart ({cart.length})
          </span>

          <span
            onClick={openWishlist}
            style={{ cursor: "pointer" }}
          >
            Wishlist ({wishlist.length})
          </span>

          <FaUserCircle className="profile-icon" />
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isWishlisted = wishlist.some(
                (item) => item.id === product.id
              );

              return (
                <div className="service-card" key={product.id}>
                  <button
                    className={`wishlist-icon ${
                      isWishlisted ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
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
                      navigate(`/product/${product.id}`, {
                        state: { product },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  />

                  <h3
                    onClick={() =>
                      navigate(`/product/${product.id}`, {
                        state: { product },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {product.name}
                  </h3>

                  <p>{product.category}</p>

                  <h4>
                    ₹{product.price.toLocaleString("en-IN")}
                  </h4>

                  <button
                    className="product-button"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
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
