import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartByUser, getProductById, updateCart } from '../services/productService';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data: carts } = await getCartByUser(1);

        if (carts && carts.length > 0) {
          const latestCart = carts[carts.length - 1];
          setCart(latestCart);

          const productPromises = latestCart.products.map(async (item) => {
            const { data: product } = await getProductById(item.productId);
            return { ...product, quantity: item.quantity };
          });

          const products = await Promise.all(productPromises);
          setCartProducts(products);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      const updatedProducts = cartProducts
        .filter((p) => p.id !== productId)
        .map((p) => ({ productId: p.id, quantity: p.quantity }));

      await updateCart(1, {
        userId: 1,
        date: new Date().toISOString(),
        products: updatedProducts,
      });

      setCartProducts(cartProducts.filter((p) => p.id !== productId));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cart...</p>
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

  const totalPrice = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>🛒 Your Cart</h1>

      {cartProducts.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart!</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartProducts.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <div className="cart-item-details">
                    <span className="cart-item-price">${item.price}</span>
                    <span className="cart-item-quantity">Qty: {item.quantity}</span>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-price">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-lg btn-checkout">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
