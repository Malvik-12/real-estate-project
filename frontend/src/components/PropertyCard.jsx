import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/PropertyCard.css";
import { API_BASE_URL } from "../utils/api";

const TYPE_CONFIG = {
  home:    { label: "House",    color: "#0b3d91" },
  land:    { label: "Land",     color: "#7c3aed" },
  forsale: { label: "For Sale", color: "#dc2626" },
};

const PropertyCard = ({ property }) => {

  const {
    id,
    price,
    title = "Property Title",
    location = "Location not specified",
    image_url,
    created_at,
    type = "home",
    area = "0-0-0-0",
    beds = "0",
    parking = 0,
    isEntire
  } = property;

  // Handle JSON Parsing for the Multiple Images
  let finalImageUrl = "https://via.placeholder.com/400x300?text=No+Image";
  
  try {
    const images = typeof image_url === "string" ? JSON.parse(image_url) : image_url;
    if (Array.isArray(images) && images.length > 0) {
      finalImageUrl = `${API_BASE_URL}${images[0]}`;
    }
  } catch {
    if (typeof image_url === "string" && image_url.startsWith('/')) {
      finalImageUrl = `${API_BASE_URL}${image_url}`;
    }
  }

  const formattedPrice = price ? Number(price).toLocaleString('en-IN') : "N/A";
  const formattedDate = created_at ? new Date(created_at).toLocaleDateString() : "Recently";
  const typeInfo = TYPE_CONFIG[type] || TYPE_CONFIG.home;

  return (
    <Link to={`/property/${id}`} className="property-card-link">
      <div className="property-card">
        <div className="image-container">
          <div
            className="ribbon"
            style={{ background: typeInfo.color }}
          >
            {typeInfo.label}
          </div>
      
          <img
            src={finalImageUrl}
            alt={title}
            className="property-image"
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
          />
    
          <div className="image-overlay">
            <h3 className="property-title">{title}</h3>
            <p className="property-location">📍 {location}</p>
          </div>
        </div>
      
        <div className="property-bottom-info">
          <p className="property-meta">Code NRES-{id} • Posted on {formattedDate}</p>
          
          <div className="property-price-row">
            <span className="property-price">Nrs. {formattedPrice}</span>
            {isEntire && <span className="price-suffix"> (Full Property)</span>}
          </div>
      
          <div className="property-stats">
            <span>📐 {area}</span>
            <span>🛏️ {beds} Bed</span>
            {/* 2. DYNAMIC PARKING: Shows the real number from DB */}
            <span>🚗 {parking} {parking === 1 ? 'Car' : 'Cars'}</span>
          </div>
          
          <div className="view-details-tag">
             View Details & Inquire →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;