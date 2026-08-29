import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";

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
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    const totalFiles = imageFiles.length + newFiles.length;
    if (totalFiles > 15) {
      toast.error(`You can upload up to 15 images. You already have ${imageFiles.length}.`);
      e.target.value = "";
      return;
    }

    const updatedFiles = [...imageFiles, ...newFiles];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setImageFiles(updatedFiles);
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = ""; // reset input so the same file can be picked again
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
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
      const token = sessionStorage.getItem("admin_token");
      const response = await fetch(`${API_BASE_URL}/api/properties`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
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
            Upload Photos ({imageFiles.length}/15)
          </label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
          />
        </div>
        
        {previews.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px", marginTop: "10px" }}>
            {previews.map((src, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img 
                  src={src} 
                  alt="Preview" 
                  style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} 
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute", top: "4px", right: "4px",
                    background: "rgba(0,0,0,0.6)", color: "#fff",
                    border: "none", borderRadius: "50%", width: "22px", height: "22px",
                    cursor: "pointer", fontSize: "12px", lineHeight: "22px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  ✕
                </button>
              </div>
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