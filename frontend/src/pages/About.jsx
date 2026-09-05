import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", fontFamily: "inherit" }}>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "60px 20px 40px", background: "linear-gradient(135deg, #1e2a3a, #0f172a)", borderRadius: "16px", color: "#fff", marginBottom: "40px" }}>
        <div style={{ fontSize: "52px", marginBottom: "12px" }}>🏠</div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px" }}>
          Bahumukhi Investment Company Pvt. Ltd.
        </h1>
        <p style={{ fontSize: "16px", color: "#94a3b8", maxWidth: "600px", margin: "0 auto" }}>
          Nepal's trusted real estate partner — helping families and investors find premium properties across the country.
        </p>
      </section>

      {/* Who We Are */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "14px", borderLeft: "4px solid #1e2a3a", paddingLeft: "14px" }}>
          Who We Are
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "15px" }}>
          Bahumukhi Investment Company Pvt. Ltd. is a leading real estate firm based in Imadol, Lalitpur, Nepal. We specialize in the buying, selling, and management of residential and commercial properties — from family homes and land plots to premium investment listings.
        </p>
        <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "15px", marginTop: "12px" }}>
          Our team brings deep local market knowledge, transparent dealings, and a commitment to making property transactions smooth and stress-free for every client.
        </p>
      </section>

      {/* What We Offer */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px", borderLeft: "4px solid #1e2a3a", paddingLeft: "14px" }}>
          What We Offer
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { icon: "🏠", title: "House Listings", desc: "Premium residential homes for families and individuals." },
            { icon: "🌿", title: "Land & Plots", desc: "Investment-ready land in prime locations across Nepal." },
            { icon: "🏷️", title: "For Sale Listings", desc: "Exclusive listings for buyers seeking unique deals." },
            { icon: "📋", title: "Legal Assistance", desc: "Help with ownership transfers and documentation." },
            { icon: "💼", title: "Investment Consulting", desc: "Expert guidance on real estate investment strategies." },
            { icon: "🔑", title: "Property Management", desc: "End-to-end management services for property owners." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{ background: "#1e2a3a", borderRadius: "12px", padding: "32px", color: "#fff", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>📞 Contact Us</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "4px" }}>📍 Address</p>
            <p style={{ fontSize: "15px" }}>Krishna Mandir, Imadol, Lalitpur, Nepal</p>
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "4px" }}>📞 Phone</p>
            <a href="tel:+9779851220315" style={{ fontSize: "15px", color: "#60a5fa", textDecoration: "none" }}>+977 9851220315</a>
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "4px" }}>✉️ Email</p>
            <a href="mailto:info@bahumukhi.com" style={{ fontSize: "15px", color: "#60a5fa", textDecoration: "none" }}>info@bahumukhi.com</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "20px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px", color: "#0f172a" }}>
          Ready to find your dream property?
        </h3>
        <Link
          to="/"
          style={{ display: "inline-block", background: "#1e2a3a", color: "#fff", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "15px" }}
        >
          Browse All Listings →
        </Link>
      </section>
    </div>
  );
};

export default About;