import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from "../components/PropertyCard";
import "../styles/Home.css"; // Reuse your existing grid and layout styles

const ForSale = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/properties");
        const data = await res.json();
        setAllProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter for "For Sale" category
  const forSaleProperties = useMemo(() => {
    return allProperties.filter(p => p.type === 'forsale');
  }, [allProperties]);

  return (
    <div className="home">
      <header className="page-header">
        <h1>Properties For Sale</h1>
        <p>Exclusive investment opportunities and residential listings.</p>
      </header>

      <div className="property-grid">
        {loading ? (
          <div className="loading-state">Fetching listings...</div>
        ) : forSaleProperties.length > 0 ? (
          forSaleProperties.map((p) => (
            <PropertyCard key={p.id || p._id} property={p} />
          ))
        ) : (
          <div className="no-results">
            <p>No properties currently marked for sale.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForSale;