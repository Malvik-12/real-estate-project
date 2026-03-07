import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProperty = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState("");
  
  // --- NEW PARKING STATE ---
  const [parking, setParking] = useState("");
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    previews.forEach(url => URL.revokeObjectURL(url));
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed.");
      e.target.value = ""; 
      setPreviews([]);
      setImageFiles([]);
      return;
    }

    setImageFiles(files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      return toast.error("Please upload at least one image.");
    }

    const loadingToast = toast.loading("Uploading property...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("area", area);
    formData.append("beds", beds);

    // --- APPEND PARKING TO FORMDATA ---
    // We send it as a string here; backend parseInt() handles it.
    formData.append("parking", parking || 0); 

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:5001/api/properties", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Property listed successfully!", { id: loadingToast });
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Upload failed.", { id: loadingToast });
      }
    } catch {
      toast.error("Server connection lost.", { id: loadingToast });
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Add New Property</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="text" 
          placeholder="Property Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={inputStyle}
        />

        <input 
          type="text" 
          placeholder="Location (e.g., Lalitpur, Bhaisepati)" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            type="number" 
            placeholder="Price (Nrs)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
            style={{ ...inputStyle, flex: 2 }}
          />
          
          <select value={type} onChange={(e) => setType(e.target.value)} required style={{ ...inputStyle, flex: 1 }}>
            <option value="" disabled>Select Type</option>
            <option value="home">House</option>
            <option value="land">Land</option>
            <option value="forsale">For Sale</option>
          </select>
        </div>

        {/* --- AREA, BEDS, & PARKING ROW --- */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            placeholder="Area (0-4-0-0)" 
            value={area} 
            onChange={(e) => setArea(e.target.value)} 
            style={{ ...inputStyle, flex: 1 }}
          />
          <input 
            type="number" 
            placeholder="Beds" 
            value={beds} 
            onChange={(e) => setBeds(e.target.value)} 
            style={{ ...inputStyle, flex: 1 }}
          />
          {/* --- NEW PARKING INPUT --- */}
          <input 
            type="number" 
            placeholder="Parking" 
            value={parking} 
            onChange={(e) => setParking(e.target.value)} 
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          rows="4" 
          style={inputStyle}
        />
        
        <div style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", borderRadius: "8px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
            Upload Photos (Max 5)
          </label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
            required 
          />
        </div>
        
        {previews.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px", marginTop: "10px" }}>
            {previews.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt="Preview" 
                style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} 
              />
            ))}
          </div>
        )}

        <button type="submit" style={submitBtnStyle}>
          Publish Property
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  fontSize: "16px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box"
};

const submitBtnStyle = {
  padding: "15px", 
  backgroundColor: "#28a745", 
  color: "#fff", 
  border: "none",
  borderRadius: "5px",
  cursor: "pointer", 
  marginTop: "10px",
  fontSize: "16px",
  fontWeight: "bold"
};

export default AddProperty;