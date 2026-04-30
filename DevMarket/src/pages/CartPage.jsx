import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PROBLEM: Hardcoded URL, manual token retrieval, nested .then chains
    const token = localStorage.getItem('auth_token');

    fetch('https://fakestoreapi.com/carts/user/1', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch cart');
        }
        return res.json();
      })
      .then((carts) => {
        if (carts && carts.length > 0) {
          const latestCart = carts[carts.length - 1];
          setCart(latestCart);

          // PROBLEM: Nested fetch calls with hardcoded URLs
          const productPromises = latestCart.products.map((item) =>
            fetch(`https://fakestoreapi.com/products/${item.productId}`)
              .then((res) => res.json())
              .then((product) => ({
                ...product,
                quantity: item.quantity,
              }))
          );

          return Promise.all(productPromises);
        }
        return [];
      })
      .then((products) => {
        setCartProducts(products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleRemoveItem = (productId) => {
    // PROBLEM: Hardcoded URL, manual token
    const token = localStorage.getItem('auth_token');

    fetch(`https://fakestoreapi.com/carts/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString(),
        products: cartProducts
          .filter((p) => p.id !== productId)
          .map((p) => ({ productId: p.id, quantity: p.quantity })),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update cart');
        return res.json();
      })
      .then(() => {
        setCartProducts(cartProducts.filter((p) => p.id !== productId));
      })
      .catch((err) => {
        alert('Error: ' + err.message);
      });
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
