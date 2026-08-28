import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from "../components/PropertyCard";
import "../styles/Home.css";
import { API_BASE_URL } from "../utils/api";

const Listings = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/properties`);
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

  const houseProperties = useMemo(() => {
    return allProperties.filter(p => p.type === 'home');
  }, [allProperties]);

  return (
    <div>
      <section className="subpage-hero">
        <h1>🏠 House Listings</h1>
        <p>Explore premium residential properties available across Nepal</p>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-icon">🏠</span>
            <div>
              <h2>{loading ? "Loading…" : `${houseProperties.length} House${houseProperties.length !== 1 ? "s" : ""} Available`}</h2>
              <p className="section-sub">Residential properties for families and investors</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line medium" />
                </div>
              </div>
            ))}
          </div>
        ) : houseProperties.length > 0 ? (
          <div className="property-grid">
            {houseProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <p>No houses found at the moment. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Listings;