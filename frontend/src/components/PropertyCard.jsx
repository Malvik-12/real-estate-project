import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  const API_BASE_URL = "http://localhost:5001";

  const {
    id,
    price,
    title = "Property Title",
    location = "Location not specified",
    image_url,
    created_at,
    area = "0-0-0-0",
    beds = "0",
    isEntire
  } = property;

  // 1. Handle JSON Parsing for the Multiple Images
  let finalImageUrl = "https://via.placeholder.com/400x300?text=No+Image";
  
  try {
    const images = typeof image_url === "string" ? JSON.parse(image_url) : image_url;
    if (images && images.length > 0) {
      // Prepend API URL to the FIRST image in the array
      finalImageUrl = `${API_BASE_URL}${images[0]}`;
    }
  } catch {
    // If parsing fails, it might be an old single string or null
    if (typeof image_url === "string" && image_url.startsWith('/')) {
      finalImageUrl = `${API_BASE_URL}${image_url}`;
    }
  }

  const formattedPrice = price
    ? Number(price).toLocaleString('en-IN')
    : "N/A";

  const formattedDate = created_at 
    ? new Date(created_at).toLocaleDateString() 
    : "Recently";

  return (
    // 2. Wrap the entire card in a Link to enable the "Click to Open" flow
    <Link to={`/property/${id}`} className="property-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="property-card">
        <div className="image-container">
          <div className="ribbon">For Sale</div>
          
          <img
            src={finalImageUrl}
            alt={title}
            className="property-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
            }}
          />
          
          <div className="image-overlay">
            <p className="property-location">📍 {location}</p>
          </div>
        </div>

        <div className="property-body">
          <p className="property-date">Posted {formattedDate}</p>
          <h3 className="property-title">{title}</h3>
          
          <div className="property-price-row">
            <span className="property-price">Nrs. {formattedPrice}</span>
            {isEntire && <span className="price-suffix"> (Full Property)</span>}
          </div>

          <div className="property-footer">
            <div className="stat" title="Area">
              <span>📐</span> {area}
            </div>
            <div className="stat" title="Bedrooms">
              <span>🛏️</span> {beds} Bed{beds !== "1" ? 's' : ''}
            </div>
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