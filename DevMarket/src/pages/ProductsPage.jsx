import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PROBLEM: Hardcoded URL, .then pattern, no centralized error handling
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="product-category">{product.category}</p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <span className="product-rating">⭐ {product.rating?.rate}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
