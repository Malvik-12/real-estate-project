import { useEffect, useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import "../styles/Home.css";

const Home = () => {
  const [propertyType, setPropertyType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [allProperties, setAllProperties] = useState([]);

  // Fetch once
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/properties", {
          cache: "no-store",
        });
        const data = await res.json();
        setAllProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    fetchProperties();
  }, []);

  // ✅ DERIVED DATA (NO setState)
  const filteredProperties = useMemo(() => {
    let data = [...allProperties];

    // Search
    if (searchTerm) {
      data = data.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (propertyType) {
      data = data.filter((p) => p.type === propertyType);
    }

    // Sort
    if (sortOrder === "price-high") {
      data.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "price-low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "oldest") {
      data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return data;
  }, [searchTerm, propertyType, sortOrder, allProperties]);

  return (
    <div className="home">
      <h1>Welcome to Bahumukhi Investment Company Private Limited</h1>

      {/* Search & Filter */}
      <div className="search-filter">
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">All Types</option>
          <option value="home">House</option>
          <option value="land">Land</option>
          <option value="forsale">For Sale</option>
        </select>

        <input
          type="text"
          placeholder="Type a keyword"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <button>Search</button>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      {/* Property Cards */}
      <div className="property-grid">
        {filteredProperties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          filteredProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;