import React from "react";
import { BedDouble, ConciergeBell, Sparkles, MapPin } from "lucide-react";
import "./HomeBackground.css";

const HomeBackground: React.FC = () => {
  return (
    <div className="home-wrapper">
      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Experience <span>Luxury</span> & Comfort
          </h1>
          <p className="hero-subtitle">
            Smart hotel management meets unforgettable guest experiences.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary">Book a Stay</button>
            <button className="btn btn-outline">Explore Services</button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">
        <div className="features-grid">
          <FeatureCard
            icon={<BedDouble size={32} color="#2563eb" />}
            title="Premium Rooms"
            description="Modern rooms designed for comfort, privacy, and relaxation."
          />
          <FeatureCard
            icon={<ConciergeBell size={32} color="#2563eb" />}
            title="24/7 Services"
            description="Room service, transport, and assistance anytime you need."
          />
          <FeatureCard
            icon={<Sparkles size={32} color="#2563eb" />}
            title="Smart Experience"
            description="AI-powered systems for seamless bookings and management."
          />
        </div>
      </section>

      {/* ================= LOCATION / CTA ================= */}
      <section className="location-section">
        <div className="location-grid">
          <div>
            <h2 className="location-title">
              Stay at the Heart of Everything
            </h2>
            <p className="location-text">
              Our hotels are located in prime destinations to give you the best
              experience.
            </p>
            <button className="btn btn-primary">View Locations</button>
          </div>

          <div className="location-card">
            <MapPin size={42} />
            <p style={{ marginTop: "0.75rem", fontWeight: 600 }}>
              Colombo • Kandy • Galle
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        © {new Date().getFullYear()} SmartStay Hotels. All rights reserved.
      </footer>
    </div>
  );
};

export default HomeBackground;

/* ================= FEATURE CARD ================= */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
}

