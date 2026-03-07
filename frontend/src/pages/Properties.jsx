import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Properties = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Inquiry Form and Success View
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    fetch(`http://localhost:5001/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data);
        // Safely parse images array from JSON string
        const parsedImages = typeof data.image_url === "string" 
          ? JSON.parse(data.image_url) 
          : data.image_url;
        setImages(parsedImages || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load property details");
        setLoading(false);
      });
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sending your inquiry...");

    try {
      const res = await fetch("http://localhost:5001/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, property_id: id }),
      });

      if (res.ok) {
        toast.success("Inquiry sent successfully!", { id: loadingToast });
        setIsSubmitted(true);
      } else {
        toast.error("Failed to send inquiry.", { id: loadingToast });
      }
    } catch {
      toast.error("Server connection error.", { id: loadingToast });
    }
  };

  if (loading) return <div style={centerStyle}>Loading Property Details...</div>;
  if (!property) return <div style={centerStyle}>Property not found.</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
      <Link to="/listings" style={{ color: "#666", textDecoration: "none", marginBottom: "20px", display: "inline-block" }}>
        ← Back to Listings
      </Link>

      {/* --- Section 1: Image Gallery (Uses the 'images' variable) --- */}
      <div style={galleryGrid}>
        <div style={{ position: "relative" }}>
          <img 
            src={`http://localhost:5001${images[0]}`} 
            style={mainImgStyle} 
            alt="Main view" 
            onError={(e) => e.target.src = "https://via.placeholder.com/800x410?text=No+Image"}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {images.slice(1, 3).map((img, i) => (
            <img 
              key={i} 
              src={`http://localhost:5001${img}`} 
              style={sideImgStyle} 
              alt={`View ${i + 1}`} 
              onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=View+Not+Available"}
            />
          ))}
          {images.length > 3 && (
            <div style={morePhotosBadge}>+{images.length - 3} more photos</div>
          )}
        </div>
      </div>

      {/* --- Section 2: Property Info --- */}
      <div style={{ marginBottom: "50px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>{property.title}</h1>
        <p style={{ color: "#666", fontSize: "18px", marginBottom: "10px" }}>📍 {property.location || "Location not specified"}</p>
        <h2 style={{ color: "#28a745", marginBottom: "20px" }}>Nrs. {Number(property.price).toLocaleString('en-IN')}</h2>
        
        <div style={statsRow}>
          <div style={statBox}>📐 Area: {property.area || "N/A"}</div>
          <div style={statBox}>🛏️ Beds: {property.beds || "0"}</div>
          <div style={statBox}>🏠 Type: {property.type}</div>
        </div>

        <p style={{ lineHeight: "1.8", color: "#444", fontSize: "17px", marginTop: "20px" }}>
          {property.description}
        </p>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "40px 0" }} />

      {/* --- Section 3: Conditional Inquiry Form/Success Message --- */}
      <div style={formWrapper}>
        {isSubmitted ? (
          <div style={successMessageStyle}>
            <div style={{ fontSize: "60px", marginBottom: "10px" }}>✅</div>
            <h2 style={{ color: "#28a745" }}>Inquiry Completed!</h2>
            <p style={{ fontSize: "18px", color: "#555" }}>
              Thank you, <strong>{formData.name}</strong>. We have received your interest in <strong>{property.title}</strong> and will contact you shortly.
            </p>
            <button onClick={() => setIsSubmitted(false)} style={resetLink}>
              Have another question? Send another message.
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: "25px", fontSize: "22px" }}>Interested in this property?</h3>
            <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", gap: "15px" }}>
                <input 
                  style={inputStyle} type="text" placeholder="Full Name" required 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                  style={inputStyle} type="email" placeholder="Email Address" required 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <input 
                style={inputStyle} type="text" placeholder="Phone Number" 
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
              <textarea 
                style={inputStyle} rows="4" placeholder="I am interested in this property and would like more information..." 
                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} 
              />
              <button type="submit" style={submitBtn}>Submit Inquiry</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const centerStyle = { textAlign: "center", padding: "100px", fontSize: "20px", color: "#666" };
const galleryGrid = { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "30px" };
const mainImgStyle = { width: "100%", height: "410px", objectFit: "cover", borderRadius: "12px", border: "1px solid #eee" };
const sideImgStyle = { width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", border: "1px solid #eee" };
const morePhotosBadge = { textAlign: "center", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", color: "#666" };
const statsRow = { display: "flex", gap: "15px", flexWrap: "wrap", margin: "20px 0" };
const statBox = { padding: "10px 15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #eee", fontSize: "14px" };
const formWrapper = { backgroundColor: "#fff", padding: "40px", borderRadius: "15px", border: "1px solid #eee", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", outline: "none" };
const submitBtn = { padding: "15px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" };
const successMessageStyle = { textAlign: "center", padding: "20px" };
const resetLink = { background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline", marginTop: "20px", fontSize: "14px" };

export default Properties;