import { useState, useEffect } from 'react';
import { searchProducts } from '../api/shopwaveApi';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // FIX Bug #1 & #2: Debouncing and proper dependency management
    // We remove 'results' from dependencies to prevent the infinite loop.
    // We add a debounce timer to avoid firing requests on every keystroke.
    
    if (query.trim() === '') {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      
      // We use a local flag to handle race conditions (late-arriving responses)
      let isCurrent = true;

      searchProducts(query).then((data) => {
        if (isCurrent) {
          setResults(data);
          setLoading(false);
        }
      });

      return () => {
        isCurrent = false;
      };
    }, 400); // 400ms debounce

    // Cleanup function: clears the timer if the user types again before 400ms
    return () => clearTimeout(timer);
    
  }, [query]); // Only re-run when the search query changes

  return (
    <div className="page">
      <div className="page-header">
        <h1>dY"? Product Search</h1>
        <p className="subtitle">
          Search ShopWave's entire product catalogue in real time.
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Try 'wireless', 'fitness', 'kitchen'?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && (
        <div className="spinner-wrap">
          <div className="spinner" />
          <p>Searching products?</p>
        </div>
      )}

      {!loading && results.length === 0 && query.trim() !== '' && (
        <div className="empty-state">
          No products found for "{query}".
        </div>
      )}

      <div className="product-grid">
        {results.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-category">{product.category}</div>
            <h3 className="product-name">{product.name}</h3>
            <div className="product-meta">
              <span className="price">${product.price.toFixed(2)}</span>
              <span className="stock">{product.stock} in stock</span>
            </div>
            <div className="sales-badge">+ {product.sales} sold</div>
          </div>
        ))}
      </div>
    </div>
  );
}
