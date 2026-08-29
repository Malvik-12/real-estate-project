import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from "../components/PropertyCard";
import "../styles/Home.css";
import { API_BASE_URL } from "../utils/api";

const ForSale = () => {
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

  const forSaleProperties = useMemo(() => {
    if (!Array.isArray(allProperties)) return [];
    return allProperties.filter((p) => {
      const type = (p.type || "").toLowerCase().trim();
      return type === "forsale" || type === "for sale" || type === "sale";
    });
  }, [allProperties]);

  return (
    <div>
      <section className="subpage-hero">
        <h1>🏷️ Properties For Sale</h1>
        <p>Exclusive investment opportunities and residential listings</p>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-icon">🏷️</span>
            <div>
              <h2>{loading ? "Loading…" : `${forSaleProperties.length} Propert${forSaleProperties.length !== 1 ? "ies" : "y"} For Sale`}</h2>
              <p className="section-sub">Browse our exclusive for-sale listings</p>
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
        ) : forSaleProperties.length > 0 ? (
          <div className="property-grid">
            {forSaleProperties.map((p) => (
              <PropertyCard key={p.id || p._id} property={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <p>No properties currently marked for sale.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ForSale;