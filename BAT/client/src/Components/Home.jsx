import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Birthday Anniversary Tracker</h1>
          <p>Track birthdays, anniversaries, and team events in one place.</p>
          <button className="cta-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
        <div className="hero-image">
          <img
            src="https://source.unsplash.com/600x400/?team,office"
            alt="Corporate teamwork"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>What You Get</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img
              src="https://source.unsplash.com/200x200/?calendar"
              alt="Calendar"
            />
            <h3>Event Tracking</h3>
            <p>Never miss a birthday or work anniversary again.</p>
          </div>
          <div className="feature-card">
            <img
              src="https://source.unsplash.com/200x200/?notification"
              alt="Notification"
            />
            <h3>Smart Reminders</h3>
            <p>Get notified automatically on important dates.</p>
          </div>
          <div className="feature-card">
            <img src="https://source.unsplash.com/200x200/?team" alt="Team" />
            <h3>Team Management</h3>
            <p>Organize and celebrate milestones with your team.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 Birthday Anniversary Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
