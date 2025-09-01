import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaBell, FaUsers } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>
            🎉 Celebrate Every <span>Moment</span>
          </h1>
          <p>
            A stylish way to track birthdays, anniversaries & milestones — with
            a touch of magic ✨
          </p>
          <button className="btn-glow" onClick={handleGetStarted}>
            🚀 Get Started
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>🔥 Why You’ll Love It</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaCalendarAlt className="icon" />
            <h3>Event Tracking</h3>
            <p>Never miss a special day again with elegant reminders.</p>
          </div>
          <div className="feature-card">
            <FaBell className="icon" />
            <h3>Smart Alerts</h3>
            <p>Birthday and Anniversary remainders that match your style.</p>
          </div>
          <div className="feature-card">
            <FaUsers className="icon" />
            <h3>Team Spirit</h3>
            <p>Bring people together and celebrate milestones in style.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Make Every Occasion Memorable</h2>
        <p>Start today and never miss another celebration with your team.</p>
        <button className="btn-glow" onClick={handleGetStarted}>
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Birthday Anniversary Tracker. Designed with ❤</p>
      </footer>
    </div>
  );
};

export default Home;
