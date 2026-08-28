import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from "../components/PropertyCard";
import "../styles/Home.css";
import { API_BASE_URL } from "../utils/api";

const Land = () => {
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

  const landProperties = useMemo(() => {
    return allProperties.filter(p => p.type === 'land');
  }, [allProperties]);

  return (
    <div>
      <section className="subpage-hero">
        <h1>🌿 Lands &amp; Plots</h1>
        <p>Invest in the future with our curated land listings across Nepal</p>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-icon">🌿</span>
            <div>
              <h2>{loading ? "Loading…" : `${landProperties.length} Plot${landProperties.length !== 1 ? "s" : ""} Available`}</h2>
              <p className="section-sub">Prime land locations for residential &amp; commercial development</p>
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
        ) : landProperties.length > 0 ? (
          <div className="property-grid">
            {landProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🌿</div>
            <p>No land listings available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Land;