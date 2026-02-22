import React, { useEffect, useState } from "react";
import "../styles/Home.css";

const Home = () => {
  const [propertyType, setPropertyType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [listings, setListings] = useState([]);
  const [lands, setLands] = useState([]);
  const [forsale, setForsale] = useState([]);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async (type, setState) => {
      try {
        const res = await fetch(`http://localhost:5001/api/properties?type=${type}`);
        const data = await res.json();
        setState(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    fetchProperties("home", setListings);
    fetchProperties("land", setLands);
    fetchProperties("forsale", setForsale);
  }, []);

  return (
    <div className="home">
      <h1>Welcome to Bahumukhi Investment Company Private Limited</h1>
      <p>Explore our properties and investment opportunities.</p>

      {/* Search & Filter Section */}
      <div className="search-filter">
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">Property Type</option>
          <option value="home">House</option>
          <option value="land">Land</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
        </select>

        <input
          type="text"
          placeholder="Type a keyword"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>Search</button>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      {/* Listings Section */}
      <div className="carousel-section">
        <h2>Top Listings</h2>
        {listings.length === 0 ? <p>No properties yet</p> : listings.map((p) => <div key={p.id}>{p.title}</div>)}
      </div>

      {/* Lands Section */}
      <div className="carousel-section">
        <h2>Lands</h2>
        {lands.length === 0 ? <p>No lands yet</p> : lands.map((p) => <div key={p.id}>{p.title}</div>)}
      </div>

      {/* For Sale Section */}
      <div className="carousel-section">
        <h2>For Sale Properties</h2>
        {forsale.length === 0 ? <p>No properties for sale yet</p> : forsale.map((p) => <div key={p.id}>{p.title}</div>)}
      </div>
    </div>
  );
};

export default Home;