import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import "../styles/Home.css";
import { API_BASE_URL } from "../utils/api";

const SKELETON_COUNT = 3;
const CARDS_PER_PAGE = 3;

const Home = () => {
  const [inputValue, setInputValue]     = useState("");
  const [searchTerm, setSearchTerm]     = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortOrder, setSortOrder]       = useState("newest");
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading]           = useState(true);

  // One carousel page state per section
  const [pages, setPages] = useState({ top: 0, recent: 0, house: 0, land: 0, forsale: 0 });

  const setPage = (key, val) => setPages(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/properties`, { cache: "no-store" });
        const data = await res.json();
        setAllProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Category counts
  const counts = useMemo(() => ({
    home:    allProperties.filter(p => p.type === "home").length,
    land:    allProperties.filter(p => p.type === "land").length,
    forsale: allProperties.filter(p => p.type === "forsale").length,
  }), [allProperties]);

  // Sorted by newest
  const byNewest = useMemo(() =>
    [...allProperties].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [allProperties]
  );

  // Sorted by highest price — used for "Top Listing" section
  const byPrice = useMemo(() =>
    [...allProperties].sort((a, b) => Number(b.price) - Number(a.price)),
    [allProperties]
  );

  const houses  = useMemo(() => byNewest.filter(p => p.type === "home"),    [byNewest]);
  const lands   = useMemo(() => byNewest.filter(p => p.type === "land"),    [byNewest]);
  const forsale = useMemo(() => byNewest.filter(p => p.type === "forsale"), [byNewest]);

  // Search filtered
  const filteredProperties = useMemo(() => {
    let data = [...allProperties];
    if (searchTerm) data = data.filter(p =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (propertyType) data = data.filter(p => p.type === propertyType);
    if (sortOrder === "price-high") data.sort((a, b) => b.price - a.price);
    else if (sortOrder === "price-low")  data.sort((a, b) => a.price - b.price);
    else if (sortOrder === "oldest")     data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else                                 data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return data;
  }, [searchTerm, propertyType, sortOrder, allProperties]);

  const handleSearch = (e) => { e.preventDefault(); setSearchTerm(inputValue); };
  const isFiltered = searchTerm || propertyType;

  // Carousel helpers
  const paginate   = (arr, page) => arr.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
  const totalPages = (arr) => Math.max(1, Math.ceil(arr.length / CARDS_PER_PAGE));

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Recently";

  const SkeletonGrid = () => (
    <div className="loading-grid">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-body">
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
            <div className="skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  );

  // Reusable section component — always 3 per row with ‹ › arrows
  const ListingSection = ({ title, icon, viewAllLink, items, pageKey, badge, showDate, className }) => {
    const page  = pages[pageKey] || 0;
    const total = totalPages(items);
    const visible = paginate(items, page);

    return (
      <section className={`home-section ${className || ""}`}>
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-icon">{icon}</span>
            <div>
              <h2>{title}</h2>
              {badge && <span className="section-badge">{badge}</span>}
            </div>
          </div>
          <div className="section-header-right">
            <Link to={viewAllLink} className="view-all-link">+ View All Listings</Link>
            {total > 1 && (
              <div className="carousel-controls">
                <button
                  className="carousel-btn"
                  onClick={() => setPage(pageKey, Math.max(0, page - 1))}
                  disabled={page === 0}
                  aria-label="Previous"
                >‹</button>
                <span className="carousel-indicator">{page + 1}/{total}</span>
                <button
                  className="carousel-btn"
                  onClick={() => setPage(pageKey, Math.min(total - 1, page + 1))}
                  disabled={page >= total - 1}
                  aria-label="Next"
                >›</button>
              </div>
            )}
          </div>
        </div>

        {loading ? <SkeletonGrid /> : visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏗️</div>
            <p>No listings in this category yet.</p>
          </div>
        ) : (
          <div className="property-grid">
            {visible.map((p) => (
              <div key={p.id} className={showDate ? "recent-card-wrapper" : undefined}>
                {showDate && (
                  <div className="recent-date-badge">📅 {fmtDate(p.created_at)}</div>
                )}
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-label">🇳🇵 Nepal's Trusted Real Estate</div>
        <h1>Find Your Dream <span>Property</span><br />in Nepal</h1>
        <p className="hero-subtitle">
          Browse premium houses, lands &amp; investment opportunities across Nepal
        </p>

        <form className="search-bar-container" onSubmit={handleSearch}>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">All Types</option>
            <option value="home">House</option>
            <option value="land">Land</option>
            <option value="forsale">For Sale</option>
          </select>
          <input
            className="search-input"
            type="text"
            placeholder="Search by title or location…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High → Low</option>
            <option value="price-low">Price: Low → High</option>
          </select>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </section>

      {/* ---- Category Stats ---- */}
      <div className="category-stats">
        <Link to="/listings" className="stat-card">
          <div className="stat-card-icon">🏠</div>
          <div className="stat-card-info">
            <strong>{loading ? "—" : counts.home}</strong>
            <span>Houses</span>
          </div>
        </Link>
        <Link to="/lands" className="stat-card">
          <div className="stat-card-icon">🌿</div>
          <div className="stat-card-info">
            <strong>{loading ? "—" : counts.land}</strong>
            <span>Lands &amp; Plots</span>
          </div>
        </Link>
        <Link to="/forsale" className="stat-card">
          <div className="stat-card-icon">🏷️</div>
          <div className="stat-card-info">
            <strong>{loading ? "—" : counts.forsale}</strong>
            <span>For Sale</span>
          </div>
        </Link>
      </div>

      {/* ===== SEARCH RESULTS ===== */}
      {isFiltered && (
        <section className="home-section">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-icon">🔍</span>
              <div><h2>{filteredProperties.length} Propert{filteredProperties.length !== 1 ? "ies" : "y"} Found</h2></div>
            </div>
            <button className="clear-filters-btn"
              onClick={() => { setSearchTerm(""); setInputValue(""); setPropertyType(""); }}>
              Clear Filters ✕
            </button>
          </div>
          {filteredProperties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p>No properties found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="property-grid">
              {filteredProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </section>
      )}

      {/* ===== SECTIONS (when not filtered) ===== */}
      {!isFiltered && (
        <>
          <ListingSection
            title="Top Listing"
            icon="🏆"
            viewAllLink="/listings"
            items={byPrice}
            pageKey="top"
          />

          <ListingSection
            title="Recently Uploaded"
            icon="🆕"
            viewAllLink="/listings"
            items={byNewest}
            pageKey="recent"
            showDate
            className="recently-section"
          />

          {(loading || houses.length > 0) && (
            <ListingSection
              title="House Listings"
              icon="🏠"
              badge={`${houses.length} Available`}
              viewAllLink="/listings"
              items={houses}
              pageKey="house"
            />
          )}

          {(loading || lands.length > 0) && (
            <ListingSection
              title="Land & Plots"
              icon="🌿"
              badge={`${lands.length} Available`}
              viewAllLink="/lands"
              items={lands}
              pageKey="land"
            />
          )}

          {(loading || forsale.length > 0) && (
            <ListingSection
              title="For Sale"
              icon="🏷️"
              badge={`${forsale.length} Available`}
              viewAllLink="/forsale"
              items={forsale}
              pageKey="forsale"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;