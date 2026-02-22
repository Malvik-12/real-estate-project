export const fetchProperties = async (type) => {
  try {
    const response = await fetch(`http://localhost:5001/api/properties?type=${type}`);
    if (!response.ok) throw new Error("Failed to fetch properties");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};