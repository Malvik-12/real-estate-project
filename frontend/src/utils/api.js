// Central API configuration
// All fetch calls should import API_BASE_URL from here instead of hardcoding localhost.
// To change the backend URL, update VITE_API_URL in the frontend .env file.

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://real-estate-project-2-9ejz.onrender.com");


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