import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from "../components/PropertyCard";
import "../styles/Listings.css";

const Listings = () => {
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

  // Filter ONLY houses for this page
  const houseProperties = useMemo(() => {
    return allProperties.filter(p => p.type === 'home');
  }, [allProperties]);

  return (
    <div className="listings-page">
      <div className="container">
        <h1>House Listings</h1>
        <p>Explore the best residential properties available.</p>

        <div className="property-grid">
          {loading ? (
            <p>Loading Houses...</p>
          ) : houseProperties.length > 0 ? (
            houseProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))
          ) : (
            <p>No houses found at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;