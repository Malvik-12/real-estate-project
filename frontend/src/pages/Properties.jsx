import React, { useEffect, useState } from "react";

const Properties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/properties") // backend URL
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  return (
    <div>
      <h1>Properties</h1>
      {properties.length === 0 ? (
        <p>No properties available</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <h2>{property.title}</h2>
              <p>{property.description}</p>
              <p>Price: ${property.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Properties;