import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import React from "react";

// Pages
import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import Lands from "./pages/Lands.jsx";
import ForSale from "./pages/ForSale.jsx";
import FAQ from "./pages/FAQ.jsx";
import About from "./pages/About.jsx";
import Properties from "./pages/Properties.jsx";
import Admin from "./pages/Admin.jsx";
import AddProperty from "./pages/AddProperty.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

// Components
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Notifications
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="app-container">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <Router>
        {/* Redesigned sticky navbar with active-link highlighting */}
        <Navbar />

        <div className="main-content">
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/lands" element={<Lands />} />
            <Route path="/forsale" element={<ForSale />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/property/:id" element={<Properties />} />

            {/* Admin login (public) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin pages */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add"
              element={
                <ProtectedRoute>
                  <AddProperty />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
};

export default App;