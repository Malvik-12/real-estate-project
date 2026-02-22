import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Bahumukhi Investment Company Private Limited</h1>
      <p>Explore our properties and investment opportunities.</p>

      {/* Search & Filter Section */}
      <div className="search-filter">
        <select>
          <option>Property Type</option>
          <option>House</option>
          <option>Land</option>
          <option>Apartment</option>
          <option>Villa</option>
        </select>

        <input type="text" placeholder="Type a keyword" />
        <button>Search</button>

        <select>
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Price: High to Low</option>
          <option>Price: Low to High</option>
        </select>
      </div>

      {/* Dummy Carousel Section */}
      <div className="carousel-section">
        <h2>Top Listings</h2>
        <p>No properties yet</p>
      </div>
    </div>
  );
};

export default Home;