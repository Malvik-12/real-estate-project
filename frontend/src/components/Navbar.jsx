import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/",         label: "Home",     end: true },
    { to: "/listings", label: "Listings" },
    { to: "/lands",    label: "Lands" },
    { to: "/forsale",  label: "For Sale" },
    { to: "/faq",      label: "FAQ" },
    { to: "/about",    label: "About Us" },
  ];

  return (
    <nav className="navbar">
      {/* Brand / Logo */}
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo">🏠</span>
        <span className="navbar-company"> Bahumukhi Investment Company Pvt. Ltd.</span>
      </Link>

      {/* Desktop Links */}
      <ul className="navbar-links">
        {navLinks.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Hamburger (mobile) */}
      <button
        className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile Drawer */}
      <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive ? "mobile-link active" : "mobile-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
