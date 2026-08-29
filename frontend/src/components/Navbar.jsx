import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/listings", label: "Houses" },
    { to: "/lands", label: "Lands" },
    { to: "/forsale", label: "For Sale" },
    { to: "/faq", label: "FAQ" },
    { to: "/about", label: "About Us" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">🏠</span>
          <span className="navbar-company navbar-company-desktop">
            Bahumukhi Investment Company Pvt. Ltd.
          </span>
          <span className="navbar-company navbar-company-mobile">
            Bahumukhi Real Estate
          </span>
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

        {/* Hamburger Toggle (Mobile) */}
        <button
          className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      <div
        className={`navbar-mobile-backdrop ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`navbar-mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <span className="mobile-drawer-logo">🏠</span>
            <div>
              <div className="mobile-drawer-title">Bahumukhi Real Estate</div>
              <div className="mobile-drawer-sub">Investment Company Pvt. Ltd.</div>
            </div>
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-drawer-links">
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

        <div className="mobile-drawer-footer">
          <a href="tel:+9779851220315" className="mobile-drawer-phone">
            📞 +977 9851220315
          </a>
          <p className="mobile-drawer-location">📍 Krishna Mandir, Imadol, Lalitpur</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
