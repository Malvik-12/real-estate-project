import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";
import "../styles/Properties.css";
import PropertyCard from "../components/PropertyCard";

// Helper: convert number to Nepali words (simplified)
const toNepaliWords = (num) => {
  const n = Number(num);
  if (!n) return "";
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)} Lakh`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)} Thousand`;
  return `${n}`;
};

const Properties = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("features");
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", message: ""
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data);
        const parsed = typeof data.image_url === "string"
          ? JSON.parse(data.image_url)
          : data.image_url;
        setImages(parsed || []);
        setActiveImg(0);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load property details");
        setLoading(false);
      });

    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => setAllProperties(data))
      .catch(() => {});
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sending your inquiry...");
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, property_id: id }),
      });
      if (res.ok) {
        toast.success("Inquiry sent successfully!", { id: loadingToast });
        setIsSubmitted(true);
      } else {
        toast.error("Failed to send inquiry.", { id: loadingToast });
      }
    } catch {
      toast.error("Server connection error.", { id: loadingToast });
    }
  };

  const getThumb = (p) => {
    try {
      const imgs = typeof p.image_url === "string" ? JSON.parse(p.image_url) : p.image_url;
      return imgs && imgs.length > 0 ? `${API_BASE_URL}${imgs[0]}` : null;
    } catch { return null; }
  };

  if (loading) return (
    <div className="page-loading">
      <span style={{ fontSize: 40 }}>🏠</span>
      Loading property details…
    </div>
  );
  if (!property) return (
    <div className="page-loading">
      <span style={{ fontSize: 40 }}>😕</span>
      Property not found.
    </div>
  );

  const typeLabelMap = { home: "House", land: "Land", forsale: "For Sale" };

  // Split properties into 3 sidebar groups
  const others = allProperties.filter(p => String(p.id) !== String(id));
  const topListings      = others.slice(0, 3);
  const premiumListings  = others.slice(3, 6);
  const featuredListings = others.slice(0, 4);

  let similarProperties = [];
  if (property && others.length > 0) {
    const getSimilarityScore = (p1, p2) => {
      let score = 0;
      if (p1.type === p2.type) score += 50;
      
      const loc1 = (p1.location || "").toLowerCase();
      const loc2 = (p2.location || "").toLowerCase();
      if (loc1 && loc2) {
        if (loc1 === loc2) score += 30;
        else if (loc1.includes(loc2) || loc2.includes(loc1)) score += 15;
      }
      
      const price1 = Number(p1.price);
      const price2 = Number(p2.price);
      if (price1 && price2) {
        const diffRatio = Math.abs(price1 - price2) / Math.max(price1, price2);
        if (diffRatio <= 0.3) score += 20;
      }
      
      return score;
    };

    similarProperties = [...others]
      .sort((a, b) => getSimilarityScore(property, b) - getSimilarityScore(property, a))
      .slice(0, 3);
  }

  const mainImgSrc = images.length > 0
    ? `${API_BASE_URL}${images[activeImg]}`
    : "https://placehold.co/800x420?text=No+Image";

  const timeslots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  // Features to display
  const features = [
    { icon: "🏠", label: "Type",     value: typeLabelMap[property.type] || property.type },
    { icon: "📐", label: "Area",     value: property.area || "N/A" },
    { icon: "🛏️", label: "Bedroom", value: `${property.beds || 0} Bed` },
    { icon: "🚗", label: "Parking",  value: `${property.parking || 0} Car${property.parking !== 1 ? "s" : ""}` },
    { icon: "📅", label: "Listed",   value: property.created_at ? new Date(property.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—" },
    { icon: "📍", label: "Location", value: property.location || "Nepal" },
  ];

  const SidebarSection = ({ title, icon, items, viewAllLink }) => (
    <div className="sidebar-box">
      <div className="sidebar-box-header">{icon} {title}</div>
      <ul className="sidebar-listings-list">
        {items.length === 0 ? (
          <li style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: 13 }}>
            No listings available.
          </li>
        ) : items.map((p) => {
          const thumb = getThumb(p);
          return (
            <li key={p.id} className="sidebar-listing-item">
              <Link to={`/property/${p.id}`} className="sidebar-listing-link">
                {thumb
                  ? <img src={thumb} className="sidebar-listing-img" alt={p.title} onError={(e) => e.target.src="https://placehold.co/64x52?text=N/A"} />
                  : <div className="sidebar-listing-placeholder">🏠</div>
                }
                <div className="sidebar-listing-info">
                  <p className="sidebar-listing-title">{p.title}</p>
                  <p className="sidebar-listing-location">📍 {p.location || "Nepal"}</p>
                  <p className="sidebar-listing-price">Nrs. {Number(p.price).toLocaleString("en-IN")}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to={viewAllLink} className="sidebar-view-all">+ View All</Link>
    </div>
  );

  return (
    <div className="property-detail-outer">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/listings">Top Listing</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{property.title}</span>
      </nav>

      <div className="property-detail-layout">

        {/* ===== LEFT: Main Content ===== */}
        <div className="property-detail-main">

          {/* Gallery */}
          <div className="gallery-wrapper">
            <img
              src={mainImgSrc}
              className="gallery-main-img"
              alt={property.title}
              onError={(e) => e.target.src = "https://placehold.co/800x420?text=No+Image"}
            />
            {images.length > 1 && (
              <>
                <button
                  className="gallery-nav-btn gallery-nav-prev"
                  onClick={() => setActiveImg((prev) => (prev - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="gallery-nav-btn gallery-nav-next"
                  onClick={() => setActiveImg((prev) => (prev + 1) % images.length)}
                  aria-label="Next image"
                >
                  ›
                </button>
                <div className="gallery-count-badge">
                  📷 {activeImg + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={`${API_BASE_URL}${img}`}
                  className={`gallery-thumb ${i === activeImg ? "active" : ""}`}
                  alt={`Photo ${i + 1}`}
                  onClick={() => setActiveImg(i)}
                  onError={(e) => e.target.style.display = "none"}
                />
              ))}
            </div>
          )}

          {/* Price + Meta Bar */}
          <div className="listing-meta-bar">
            <div className="listing-price-block">
              <div className="listing-price-row">
                <div className="property-detail-price">
                  Nrs. {Number(property.price).toLocaleString("en-IN")}
                </div>
                <span className="negotiable-badge">Negotiable</span>
              </div>
              <div className="price-in-words">
                {toNepaliWords(property.price)} only
              </div>
            </div>

            <div className="listing-right-meta">
              <div className="posted-by">
                Posted By — Bahumukhi Investment
              </div>
              <div className="nres-code">Code NRES-{property.id}</div>
              <div className="phone-numbers">
                <a href="tel:+9779851220315" className="phone-link">
                  📞 9851220315
                </a>
              </div>
            </div>
          </div>

          {/* Title / Badge / Location */}
          <div className="property-meta-row">
            <span className="property-type-badge">
              {typeLabelMap[property.type] || property.type}
            </span>
          </div>
          <h1 className="property-detail-title">{property.title}</h1>
          <p className="property-detail-location">📍 {property.location || "Location not specified"}</p>

          {/* Tabs */}
          <div className="property-tabs">
            <button
              className={`property-tab ${activeTab === "features" ? "active" : ""}`}
              onClick={() => setActiveTab("features")}
            >
              📋 Features
            </button>
            <button
              className={`property-tab ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              📅 Schedule Showing
            </button>
            <button
              className={`property-tab ${activeTab === "inquiry" ? "active" : ""}`}
              onClick={() => setActiveTab("inquiry")}
            >
              ✉️ Request Info
            </button>
          </div>

          {/* Tab: Features */}
          {activeTab === "features" && (
            <div>
              <div className="features-grid">
                {features.map((f, i) => (
                  <div key={i} className="feature-card">
                    <span className="feature-icon">{f.icon}</span>
                    <span className="feature-value">{f.value}</span>
                    <span className="feature-label">{f.label}</span>
                  </div>
                ))}
              </div>

              {property.description && (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>
                    Property Detail
                  </h3>
                  <p className="property-detail-description">{property.description}</p>
                </>
              )}
            </div>
          )}

          {/* Tab: Schedule Showing */}
          {activeTab === "schedule" && (
            <div className="schedule-card">
              <h3>📅 Schedule a Showing</h3>
              <p>
                Select a preferred time and we'll arrange a property visit for you. Our agent will confirm your appointment within 24 hours.
              </p>
              <div className="schedule-times">
                {timeslots.map((t) => (
                  <button
                    key={t}
                    className={`time-slot ${selectedTime === t ? "active" : ""}`}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {selectedTime && (
                <p style={{ color: "var(--success)", fontWeight: 600, fontSize: 14 }}>
                  ✅ You selected {selectedTime}. Please call <a href="tel:+9779851220315" style={{ color: "var(--primary)" }}>9851220315</a> to confirm.
                </p>
              )}
            </div>
          )}

          {/* Tab: Request Info / Inquiry Form */}
          {activeTab === "inquiry" && (
            <div className="inquiry-section">
              {isSubmitted ? (
                <div className="inquiry-success">
                  <div className="inquiry-success-icon">✅</div>
                  <h3>Inquiry Received!</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. We've received your interest in{" "}
                    <strong>{property.title}</strong> and will contact you shortly.
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="reset-inquiry-btn">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h3>📩 Request Information</h3>
                  <form onSubmit={handleInquirySubmit} className="inquiry-form">
                    <div className="form-row">
                      <input className="form-input" type="text" placeholder="Full Name" required
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      <input className="form-input" type="email" placeholder="Email Address" required
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <input className="form-input" type="text" placeholder="Phone Number"
                      value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <textarea className="form-input form-textarea"
                      placeholder="I am interested in this property and would like more information…"
                      value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                    <button type="submit" className="submit-btn">Submit Inquiry →</button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="similar-properties-section" style={{ marginTop: "40px" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)", borderBottom: "2px solid #eaeaea", paddingBottom: "10px" }}>
                Similar Properties
              </h3>
              <div className="similar-properties-grid">
                {similarProperties.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== RIGHT: Sidebar ===== */}
        <aside className="property-detail-sidebar">

          <SidebarSection
            title="Top Listings"
            icon="🏆"
            items={topListings}
            viewAllLink="/listings"
          />

          <SidebarSection
            title="Premium Listings"
            icon="⭐"
            items={premiumListings.length > 0 ? premiumListings : topListings.slice(0, 2)}
            viewAllLink="/forsale"
          />

          <SidebarSection
            title="Featured Listings"
            icon="🔥"
            items={featuredListings}
            viewAllLink="/listings"
          />

          {/* Contact Box */}
          <div className="sidebar-box">
            <div className="sidebar-box-header">📞 Contact Agent</div>
            <div className="sidebar-contact">
              <h4>Bahumukhi Investment Co.</h4>
              <p>📍 Imadol, Lalitpur, Nepal</p>
              <p>✉️ <a href="mailto:info@bahumukhi.com">info@bahumukhi.com</a></p>
              <p>📞 <a href="tel:+9779851220315">+977 9851220315</a></p>
              <a href="tel:+9779851220315" className="sidebar-call-btn">📞 Call Now</a>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Properties;