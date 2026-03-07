import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  // Graceful handling of missing data
  const {
    price,
    title = "Property Title",
    location = "Location not specified",
    image_url,
    created_at,
    area = "0-0-0-0",
    beds = "0",
    isEntire
  } = property;

  const formattedPrice = price
    ? Number(price).toLocaleString('en-IN')
    : "N/A";

  const formattedDate = created_at 
    ? new Date(created_at).toLocaleDateString() 
    : "Recently";

  return (
    <div className="property-card">
      <div className="image-container">
        {/* Only show ribbon if it's a priority/sale item */}
        <div className="ribbon">For Sale</div>
        
        <img
          src={image_url || "https://via.placeholder.com/400x300"}
          alt={title}
          className="property-image"
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
            <span>🛏️</span> {beds} Bed{beds !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;