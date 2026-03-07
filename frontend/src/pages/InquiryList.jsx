import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/inquiries")
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load inquiries");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading inquiries...</p>;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        Customer Inquiries (Leads)
      </h2>
      
      <div style={{ overflowX: "auto" }}>
        <table width="100%" style={{ borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              <th style={cellStyle}>Customer</th>
              <th style={cellStyle}>Contact</th>
              <th style={cellStyle}>Property</th>
              <th style={cellStyle}>Message</th>
              <th style={cellStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length > 0 ? (
              inquiries.map((iq) => (
                <tr key={iq.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={cellStyle}>
                    <strong>{iq.name}</strong>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ fontSize: "14px" }}>{iq.email}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{iq.phone}</div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ color: "#007bff", fontWeight: "500" }}>{iq.property_name}</span>
                  </td>
                  <td style={cellStyle}>
                    <p style={{ fontSize: "13px", maxWidth: "250px", margin: 0 }}>{iq.message}</p>
                  </td>
                  <td style={cellStyle}>
                    {new Date(iq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No inquiries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cellStyle = {
  padding: "12px",
  verticalAlign: "top"
};

export default InquiryList;