# DevMarket API Refactor — PR Submission

## Refactor: Implement Centralized API Service Layer with Interceptors

---

## The Problem

The DevMarket codebase had **scattered API calls** across 4 page components, creating multiple scalability and maintenance issues:

- **9 hardcoded `fetch()` calls** spread across `ProductsPage.jsx`, `ProductDetailPage.jsx`, `CartPage.jsx`, and `ProfilePage.jsx`
- **9 hardcoded `https://fakestoreapi.com` URLs** — changing the API base URL would require editing every file
- **7 manual `localStorage.getItem('auth_token')` calls** — token retrieval logic duplicated everywhere
- **4 duplicated 401 error handlers** — each component independently checked for `401` and redirected to `/login`
- **Mixed async patterns** — `.then()` chains in some components, `async/await` in others, and even mixed patterns within the same file
- **Zero centralized error handling** — each component had its own error handling with no consistency

This architecture breaks at scale. Adding a new API endpoint means copying boilerplate. Changing auth logic means touching every file. A single missed 401 handler creates a security gap.

---

## What I Built

A **centralized API service layer** using Axios with:

### `src/services/api.js` — Axios Instance
- Base URL sourced from `import.meta.env.VITE_API_BASE_URL`
- **Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` header if token exists in localStorage
- **Response Interceptor**: Global error handling for:
  - `401` → Clears token, redirects to `/login`
  - `403` → Logs forbidden access
  - `500+` → Generic server error handling

### `src/services/productService.js` — API Functions
Clean, reusable functions that wrap the Axios instance:
- `getProducts()` — Fetch all products
- `getProductById(id)` — Fetch single product
- `getCartByUser(userId)` — Fetch user's cart
- `addToCart(cartData)` — Add item to cart
- `updateCart(cartId, cartData)` — Update cart
- `getUserProfile(userId)` — Fetch user profile
- `updateUserProfile(userId, data)` — Update user profile

### `.env` + `.env.example`
```
VITE_API_BASE_URL=https://fakestoreapi.com
```

---

## Key Improvements

| Before | After |
|--------|-------|
| 9 hardcoded `fetch()` calls | 0 — all use service functions |
| 9 hardcoded base URLs | 1 — env variable only |
| 7 manual token retrievals | 0 — request interceptor handles it |
| 4 duplicated 401 handlers | 1 — response interceptor |
| Mixed `.then()` + `async/await` | Clean `async/await` only |
| No centralized error handling | Global interceptor-based handling |
| 0 timeout configuration | 15s timeout on all requests |

---

## Architecture Changes

```
BEFORE:
┌─────────────────┐     ┌──────────────────────┐
│  Component A     │────▶│  fetch("hardcoded")  │
│  (manual token)  │     │  .then().catch()      │
├─────────────────┤     ├──────────────────────┤
│  Component B     │────▶│  fetch("hardcoded")  │
│  (manual token)  │     │  async/await          │
├─────────────────┤     ├──────────────────────┤
│  Component C     │────▶│  fetch("hardcoded")  │
│  (manual token)  │     │  .then().then()       │
└─────────────────┘     └──────────────────────┘

AFTER:
┌─────────────────┐     ┌──────────────────────┐     ┌───────────────┐
│  Component A     │────▶│  productService.js   │────▶│   api.js      │
├─────────────────┤     │                      │     │  (axios)      │
│  Component B     │────▶│  getProducts()       │     │               │
├─────────────────┤     │  getProductById()    │     │  ┌───────────┐│
│  Component C     │────▶│  getCartByUser()     │     │  │ Interceptor││
├─────────────────┤     │  addToCart()          │     │  │ - Auth     ││
│  Component D     │────▶│  getUserProfile()    │     │  │ - 401/403 ││
└─────────────────┘     │  updateUserProfile() │     │  │ - 500+    ││
                        └──────────────────────┘     │  └───────────┘│
                                                     │  Base URL: env│
                                                     └───────────────┘
```

---

## Files Changed

| File | Change |
|------|--------|
| `DevMarket/src/services/api.js` | **NEW** — Centralized Axios instance with interceptors |
| `DevMarket/src/services/productService.js` | **NEW** — Reusable API functions |
| `DevMarket/src/pages/ProductsPage.jsx` | **REFACTORED** — Uses `getProducts()` |
| `DevMarket/src/pages/ProductDetailPage.jsx` | **REFACTORED** — Uses `getProductById()`, `addToCart()` |
| `DevMarket/src/pages/CartPage.jsx` | **REFACTORED** — Uses `getCartByUser()`, `getProductById()`, `updateCart()` |
| `DevMarket/src/pages/ProfilePage.jsx` | **REFACTORED** — Uses `getUserProfile()`, `updateUserProfile()` |
| `DevMarket/.env.example` | **NEW** — Environment variable template |
| `DevMarket/package.json` | **UPDATED** — Added `axios` dependency |

---

## Testing

### Verification via DevTools

1. **Network Tab**: All requests still hit `https://fakestoreapi.com/*` endpoints
2. **Request Headers**: `Authorization: Bearer <token>` automatically attached when token exists
3. **Console**: No errors, clean interceptor logging for 403/500+
4. **UI**: Zero visual changes — all pages render identically

### Verification Checklist

- [x] `GET /products` — ProductsPage loads all products
- [x] `GET /products/:id` — ProductDetailPage loads single product
- [x] `POST /carts` — Add to cart works from detail page
- [x] `GET /carts/user/1` — CartPage loads user's cart
- [x] `PUT /carts/1` — Remove item from cart works
- [x] `GET /users/1` — ProfilePage loads user data
- [x] `PUT /users/1` — Profile update works
- [x] Authorization header attached on all authenticated requests
- [x] 401 → auto-logout + redirect to /login
- [x] No UI/behavior changes

---

## Deployment

```bash
# Install dependencies
cd DevMarket && npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

**Deployed Link**: _[To be added after deployment]_

---

## How to Test Locally

```bash
git clone https://github.com/hardikkaurani/Kalvium-Project-Engineering-Track.git
cd Kalvium-Project-Engineering-Track/DevMarket
cp .env.example .env
npm install
npm run dev
```
