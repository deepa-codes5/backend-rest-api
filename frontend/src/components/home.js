import "./home.css";
import { FaUserCircle, FaSearch } from "react-icons/fa";

function Home() {
  return (
    <div className="home-container">

      <header className="navbar">

        <div className="logo">
          MyApp
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
          />
          <FaSearch />
        </div>

        <div className="nav-links">
          <span>Home</span>
          <span>About</span>
          <span>products</span>
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

          <button>shop now</button>
        </div>

      </section>

      <section className="services">

        <h2>Our products</h2>

        <div className="service-container">

          <div className="service-card">
            <h3>Acceseries</h3>
            <p>
              afforable and best quality.
            </p>
          </div>

          <div className="service-card">
            <h3>Dresses</h3>
            <p>
              new collection for both men and month.
            </p>
          </div>

          <div className="service-card">
            <h3>furniture</h3>
            <p>
              best compactable price and oline services.
            </p>
          </div>

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