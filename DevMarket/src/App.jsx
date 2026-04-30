import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">🛒 DevMarket</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 DevMarket. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
