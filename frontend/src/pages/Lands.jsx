import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from "../components/PropertyCard";
import "../styles/Home.css"; // Reusing your grid styles

const Land = () => {
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

  // Filter ONLY land for this page
  const landProperties = useMemo(() => {
    return allProperties.filter(p => p.type === 'land');
  }, [allProperties]);

  return (
    <div className="home">
      <h1>Available Land & Plots</h1>
      <p>Invest in the future with our curated land listings.</p>

      <div className="property-grid">
        {loading ? (
          <p>Loading Lands...</p>
        ) : landProperties.length > 0 ? (
          landProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))
        ) : (
          <p>No land listings available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Land;