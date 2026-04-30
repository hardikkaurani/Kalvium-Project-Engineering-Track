import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, addToCart } from '../services/productService';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        userId: 1,
        date: new Date().toISOString(),
        products: [{ productId: product.id, quantity: 1 }],
      });
      alert('Added to cart!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-detail-info">
          <span className="product-category-badge">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <span className="product-detail-price">${product.price}</span>
            <span className="product-detail-rating">
              ⭐ {product.rating?.rate} ({product.rating?.count} reviews)
            </span>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
