// Central API configuration
// Connected directly to live Render backend
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://real-estate-project-thg8.onrender.com";

// Legacy helper kept for backward compatibility
export const fetchProperties = async (type) => {
  try {
    const url = type
      ? `${API_BASE_URL}/api/properties?type=${type}`
      : `${API_BASE_URL}/api/properties`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch properties");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};