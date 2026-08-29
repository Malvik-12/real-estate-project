import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/MobileActionDock.css";

const MobileActionDock = () => {
  const location = useLocation();

  // If on admin or admin login, don't show consumer action dock
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="mobile-action-dock">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? "dock-item active" : "dock-item"
        }
      >
        <span className="dock-icon">🏠</span>
        <span className="dock-label">Home</span>
      </NavLink>

      <NavLink
        to="/listings"
        className={({ isActive }) =>
          isActive ? "dock-item active" : "dock-item"
        }
      >
        <span className="dock-icon">🏡</span>
        <span className="dock-label">Houses</span>
      </NavLink>

      {/* WhatsApp Quick Action (Highlighted) */}
      <a
        href="https://wa.me/9779851220315?text=Hello%20Bahumukhi%20Real%20Estate,%20I%20am%20interested%20in%20your%20properties"
        target="_blank"
        rel="noopener noreferrer"
        className="dock-item dock-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <div className="dock-whatsapp-bubble">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="currentColor"
            className="dock-wa-icon"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.101.005.232-.038.362.274.137.332.47 1.144.512 1.23.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.173.45 1.042 1.018 1.547.73.651 1.344.853 1.532.946.188.087.299.072.41-.058.116-.13.492-.578.623-.78.13-.202.26-.173.434-.101.173.072 1.101.52 1.289.607.188.087.314.13.362.202.043.087.043.491-.101.896z" />
          </svg>
        </div>
        <span className="dock-label">Chat</span>
      </a>

      <NavLink
        to="/lands"
        className={({ isActive }) =>
          isActive ? "dock-item active" : "dock-item"
        }
      >
        <span className="dock-icon">🌿</span>
        <span className="dock-label">Lands</span>
      </NavLink>

      <a href="tel:+9779851220315" className="dock-item dock-call">
        <span className="dock-icon">📞</span>
        <span className="dock-label">Call</span>
      </a>
    </div>
  );
};

export default MobileActionDock;
