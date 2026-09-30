import "./home.css";
import { FaUserCircle } from "react-icons/fa";

function Home() {
  return (
    <div className="home-container">

      <nav className="navbar">
        <div className="logo">MyApp</div>

        <div className="nav-links">
          <span>Home</span>
          <span>About</span>
          <span>Services</span>
          <span>Contact</span>
        </div>

         <FaUserCircle className="profile-icon" />
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="small-text">WELCOME TO MYAPP</p>

          <h1>
            Manage Everything
            <br />
            In One Place.
          </h1>

          <p className="description">
            A simple and secure platform to manage your account
            and access everything easily.
          </p>

          <button className="start-btn">Get Started</button>
        </div>
      </section>

      <section className="features">

        <h2>Why Choose Us?</h2>

        <div className="feature-container">

          <div className="feature-card">
            <h3>🔐 Secure</h3>
            <p>Your account is protected with secure authentication.</p>
          </div>

          <div className="feature-card">
            <h3>📧 Email OTP</h3>
            <p>Verify your account easily using email OTP.</p>
          </div>

          <div className="feature-card">
            <h3>⚡ Easy Access</h3>
            <p>Access your account quickly and manage your details.</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;