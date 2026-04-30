import api from './api';

/**
 * Product API functions
 * All product-related API calls go through the centralized axios instance.
 */

/** Fetch all products */
export const getProducts = () => {
  return api.get('/products');
};

/** Fetch a single product by ID */
export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

/**
 * Cart API functions
 */

/** Fetch cart for a specific user */
export const getCartByUser = (userId = 1) => {
  return api.get(`/carts/user/${userId}`);
};

/** Add item to cart */
export const addToCart = (cartData) => {
  return api.post('/carts', cartData);
};

/** Update cart */
export const updateCart = (cartId, cartData) => {
  return api.put(`/carts/${cartId}`, cartData);
};

/**
 * User / Profile API functions
 */

/** Fetch user profile by ID */
export const getUserProfile = (userId = 1) => {
  return api.get(`/users/${userId}`);
};

/** Update user profile */
export const updateUserProfile = (userId = 1, data) => {
  return api.put(`/users/${userId}`, data);
};
