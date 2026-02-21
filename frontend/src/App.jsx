import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import React from "react";
import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import Lands from "./pages/Lands.jsx";
import ForSale from "./pages/ForSale.jsx";
import FAQ from "./pages/FAQ.jsx";
import About from "./pages/About.jsx";

const App = () => {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ margin: "10px" }}>Home</Link>
        <Link to="/listings" style={{ margin: "10px" }}>Listings</Link>
        <Link to="/lands" style={{ margin: "10px" }}>Lands</Link>
        <Link to="/forsale" style={{ margin: "10px" }}>For Sale</Link>
        <Link to="/faq" style={{ margin: "10px" }}>FAQ</Link>
        <Link to="/about" style={{ margin: "10px" }}>About Us</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/lands" element={<Lands />} />
        <Route path="/forsale" element={<ForSale />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
      </Routes>

<footer className="footer">
  <div className="footer-container">
    <div className="footer-left">
      <h3>Contact Us</h3>
      <p>📍 Krishna Mandir, Imadol, Lalitpur, Nepal</p>
      <p>📧 info@bahumukhi.com</p>
      <p>📞 9851220315</p>
    </div>

    <div className="footer-right">
      <h3>Follow Us</h3>
      <div className="social-links">
        <a href="#">Facebook</a>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
        <a href="#">LinkedIn</a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    © 2026 Bahumukhi Investment Company
  </div>
</footer>
    </Router>
  );
};

export default App;