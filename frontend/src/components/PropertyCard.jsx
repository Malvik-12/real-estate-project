import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  // Format price to Indian/Nepali numbering system (Lakhs/Crores)
  const formattedPrice = property.price 
    ? property.price.toLocaleString('en-IN') 
    : "N/A";

  return (
    <div className="property-card">
      <div className="image-container">
        {/* Ribbon - usually logic-based, e.g., if property.status === 'sale' */}
        <div className="ribbon">For Sale</div>
        
        <img
          src={property.image || "https://via.placeholder.com/400x300"}
          alt={property.title}
          className="property-image"
        />

        <div className="image-overlay">
          <h3 className="property-title">{property.title || "HOUSE FOR SALE"}</h3>
          <p className="property-location">
            📍 {property.location || "Location not specified"}
          </p>
        </div>
      </div>

      <div className="property-body">
        <p className="property-code">
          Code {property.code || "NRES-0000"} - Posted {property.postedDate || "Recently"}
        </p>
        
        <div className="property-price-row">
          <span className="property-price">Nrs. {formattedPrice}</span>
          {property.isEntire && <span className="price-suffix"> - Entire Property</span>}
        </div>

        <div className="property-footer">
          <div className="stat">📐 {property.area || "0-0-0-0"}</div>
          <div className="stat">🛏️ {property.beds || "0"} Bed</div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;