// const FAQ = () => {
//   return (
//     <div>
//       <h1>Welcome to Real Estate</h1>
//       <p>Browse properties, lands, and more.</p>
//     </div>
//   );
// };

// export default FAQ;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FAQs.css";

const FAQs = () => {
  const [topListings, setTopListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProperties = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5001/api/properties");
        if (!res.ok) throw new Error("Failed to load listings");
        
        const data = await res.json();
        // Show only the first 5 properties as "Top Listings"
        setTopListings(data.slice(0, 5)); 
      } catch (err) {
        setError("Could not load top listings.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProperties();
  }, []);

  return (
    <div className="faq-page-container">
      {/* Left: FAQs Section */}
      <section className="faqs-section">
        <h1>FAQs</h1>
        <p>Find answers to frequently asked questions.</p>

        <div className="faq-item">
          <h3>What is Bahumukhi Investment Company?</h3>
          <p>
            Bahumukhi Investment Company is a leading real estate firm in Nepal, offering property buying, selling and management services. We specialize in lands and houses.
          </p>
        </div>

        <div className="faq-item">
          <h3>What services do we provide?</h3>
          <ul>
            <li>Property Buying and selling</li>
            <li>Real Estate Investment Consulting</li>
            <li>Property Management</li>
            <li>Legal & Financial Assistance</li>
          </ul>
        </div>

        <div className="faq-item">
          <h3>Do you assist with legal documentation?</h3>
          <p>
            Yes, we provide assistance with legal paperwork, ownership transfers and tax-related matters to ensure a smooth transaction.
          </p>
        </div>

        <div className="faq-item">
          <h3>How can I find the best property deals?</h3>
          <p>
            Our <strong>Top Listings</strong> section features premium properties. Contact us for personalized recommendations based on your budget and requirements.
          </p>
        </div>
      </section>
    
      {/* Right: Top Listings Sidebar */}
      <aside className="top-listings">
        <h3>Top Listings</h3>
        {isLoading && <p className="info-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        
        <ul>
          {topListings.map((listing) => (
            <li key={listing.id} className="top-listing-item">
              <Link to={`/property/${listing.id}`} className="top-listing-link">
                <img 
                  src={listing.image_url || "https://via.placeholder.com/100"} 
                  alt={listing.title} 
                  className="top-listing-img" 
                />
                <div className="top-listing-details">
                  <p className="top-listing-title">{listing.title}</p>
                  <p className="top-listing-price">
                    Nrs. {Number(listing.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          {!topListings.length && !isLoading && <li>No listings available.</li>}
        </ul>
      </aside>
    </div>
  );
};

export default FAQs;
