import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import React from "react";
import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import Lands from "./pages/Lands.jsx";
import ForSale from "./pages/ForSale.jsx";
import FAQ from "./pages/FAQ.jsx";
import About from "./pages/About.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <div className="app-container">
      <Router>
        {/* Navigation remains visible on all routes */}
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link to="/" style={{ margin: "10px" }}>Home</Link>
          <Link to="/listings" style={{ margin: "10px" }}>Listings</Link>
          <Link to="/lands" style={{ margin: "10px" }}>Lands</Link>
          <Link to="/forsale" style={{ margin: "10px" }}>For Sale</Link>
          <Link to="/faq" style={{ margin: "10px" }}>FAQ</Link>
          <Link to="/about" style={{ margin: "10px" }}>About Us</Link>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/lands" element={<Lands />} />
            <Route path="/forsale" element={<ForSale />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        {/* Placing Footer here ensures it appears at the bottom of every page */}
        <Footer />
      </Router>
    </div>
  );
};

export default App;