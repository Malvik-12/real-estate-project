import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import InquiryList from "./InquiryList";
import { API_BASE_URL } from "../utils/api";

const Admin = () => {
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("properties");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(() => toast.error("Failed to load properties"));
  }, []);

  const getFirstImage = (image_url) => {
    try {
      const images = typeof image_url === "string" ? JSON.parse(image_url) : image_url;
      return images && images.length > 0 ? images[0] : null;
    } catch { return null; }
  };

  const getImageCount = (image_url) => {
    try {
      const images = typeof image_url === "string" ? JSON.parse(image_url) : image_url;
      return images ? images.length : 0;
    } catch { return 0; }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    const deletePromise = fetch(`${API_BASE_URL}/api/properties/${id}`, { 
      method: "DELETE" 
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to delete");
      setProperties(properties.filter((p) => p.id !== id));
    });
    toast.promise(deletePromise, {
      loading: 'Deleting property...',
      success: 'Property removed!',
      error: 'Could not delete.',
    });
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1300px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Admin Dashboard</h1>
        <Link to="/admin/add" style={addBtnStyle}>
          + Add New Property
        </Link>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", borderBottom: "2px solid #eee" }}>
        <button 
          onClick={() => setActiveTab("properties")}
          style={activeTab === "properties" ? activeTabBtn : inactiveTabBtn}
        >
          Property Listings ({properties.length})
        </button>
        <button 
          onClick={() => setActiveTab("inquiries")}
          style={activeTab === "inquiries" ? activeTabBtn : inactiveTabBtn}
        >
          Customer Inquiries
        </button>
      </div>

{activeTab === "properties" ? (
        <div style={{ overflowX: "auto" }}>
          <table width="100%" style={{ borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                <th style={cellStyle}>Image</th>
                <th style={cellStyle}>Title & Location</th>
                <th style={cellStyle}>Price</th>
                <th style={cellStyle}>Area</th>
                <th style={cellStyle}>Beds</th>
                <th style={cellStyle}>Parking</th> {/* NEW HEADER */}
                <th style={cellStyle}>Type</th>
                <th style={cellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length > 0 ? (
                properties.map((p) => {
                  const firstImage = getFirstImage(p.image_url);
                  const totalImages = getImageCount(p.image_url);
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", position: "relative" }}>
                        <img 
                          src={`${API_BASE_URL}${firstImage}`} 
                          width="60" height="60" 
                          style={{ objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }} 
                          alt={p.title} 
                          onError={(e) => e.target.src = "https://via.placeholder.com/60"}
                        />
                        {totalImages > 1 && <span style={badgeStyle}>+{totalImages - 1}</span>}
                      </td>
                      <td style={cellStyle}>
                        <div><strong>{p.title}</strong></div>
                        <div style={{ fontSize: "12px", color: "#666" }}>📍 {p.location || "N/A"}</div>
                      </td>
                      <td style={cellStyle}>Nrs. {Number(p.price).toLocaleString('en-IN')}</td>
                      <td style={cellStyle}>{p.area || "0-0-0-0"}</td>
                      <td style={cellStyle}>{p.beds || "0"}</td>
                      <td style={cellStyle}>🚗 {p.parking || "None"}</td> {/* NEW PARKING CELL */}
                      <td style={{ ...cellStyle, textTransform: "capitalize" }}>{p.type}</td>
                      <td style={cellStyle}>
                        <button onClick={() => handleDelete(p.id)} style={deleteBtnStyle}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}> {/* ColSpan increased to 8 */}
                    No properties listed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <InquiryList /> 
      )}
    </div>
  );
};

// ... Styles remain the same ...
const cellStyle = { padding: "12px" };
const addBtnStyle = { padding: "10px 20px", background: "#28a745", color: "#fff", textDecoration: "none", borderRadius: "6px", fontWeight: "bold" };
const deleteBtnStyle = { color: "#dc3545", border: "none", cursor: "pointer", background: "none", fontWeight: "bold" };
const badgeStyle = { position: "absolute", bottom: "15px", right: "15px", backgroundColor: "rgba(0,0,0,0.8)", color: "#fff", fontSize: "10px", padding: "2px 4px", borderRadius: "3px" };
const activeTabBtn = { padding: "12px 20px", border: "none", background: "none", borderBottom: "4px solid #000", fontWeight: "bold", cursor: "pointer", fontSize: "16px" };
const inactiveTabBtn = { padding: "12px 20px", border: "none", background: "none", color: "#888", cursor: "pointer", fontSize: "16px" };

export default Admin;