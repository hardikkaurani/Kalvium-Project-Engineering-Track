# ShopFlat Structure Plan

## Current State
The `src/` directory is currently flat, containing all components, hooks, services, and utilities in a single folder.

- App.jsx
- Button.jsx
- CartItem.jsx
- CartSummary.jsx
- CheckoutModal.jsx
- Dashboard.jsx
- EmptyState.jsx
- ErrorMessage.jsx
- LoginForm.jsx
- LogoutButton.jsx
- Modal.jsx
- Navbar.jsx
- OrderCard.jsx
- OrdersList.jsx
- ProductCard.jsx
- ProductList.jsx
- Spinner.jsx
- apiClient.js
- cartService.js
- formatCurrency.js
- index.css
- loginService.js
- main.jsx
- ordersService.js
- productsService.js
- truncateText.js
- useCart.js
- useDebounce.js
- useLogin.js
- useProducts.js

## Time-to-find estimate
Based on the current flat structure, it would likely take a new engineer **15-20 minutes** to fully locate and understand the cart checkout logic (including its component, service, and state management). In a flat list of 30+ files, there is no visual grouping to guide the developer to the "cart" feature.

## Move Plan Mapping
### Features
- **auth**
  - LoginForm.jsx → features/auth/LoginForm.jsx
  - loginService.js → features/auth/loginService.js
  - useLogin.js → features/auth/useLogin.js
  - LogoutButton.jsx → features/auth/LogoutButton.jsx
- **cart**
  - CartItem.jsx → features/cart/CartItem.jsx
  - CartSummary.jsx → features/cart/CartSummary.jsx
  - cartService.js → features/cart/cartService.js
  - useCart.js → features/cart/useCart.js
  - CheckoutModal.jsx → features/cart/CheckoutModal.jsx
- **products**
  - ProductCard.jsx → features/products/ProductCard.jsx
  - ProductList.jsx → features/products/ProductList.jsx
  - productsService.js → features/products/productsService.js
  - useProducts.js → features/products/useProducts.js
- **orders**
  - OrderCard.jsx → features/orders/OrderCard.jsx
  - OrdersList.jsx → features/orders/OrdersList.jsx
  - ordersService.js → features/orders/ordersService.js
  - Dashboard.jsx → features/orders/Dashboard.jsx

### Shared
- **components**
  - Button.jsx → components/Button.jsx
  - Modal.jsx → components/Modal.jsx
  - Spinner.jsx → components/Spinner.jsx
  - Navbar.jsx → components/Navbar.jsx
  - EmptyState.jsx → components/EmptyState.jsx
  - ErrorMessage.jsx → components/ErrorMessage.jsx
- **hooks**
  - useDebounce.js → hooks/useDebounce.js
- **utils**
  - formatCurrency.js → utils/formatCurrency.js
  - truncateText.js → utils/truncateText.js
- **services**
  - apiClient.js → services/apiClient.js

### Root
- App.jsx
- main.jsx
- index.css

## Target Structure Tree
```
src/
├── features/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── LogoutButton.jsx
│   │   ├── loginService.js
│   │   └── useLogin.js
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   ├── CartSummary.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── cartService.js
│   │   └── useCart.js
│   ├── products/
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── productsService.js
│   │   └── useProducts.js
│   └── orders/
│       ├── Dashboard.jsx
│       ├── OrderCard.jsx
│       ├── OrdersList.jsx
│       └── ordersService.js
├── components/
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── Spinner.jsx
│   ├── Navbar.jsx
│   ├── EmptyState.jsx
│   └── ErrorMessage.jsx
├── hooks/
│   └── useDebounce.js
├── utils/
│   ├── formatCurrency.js
│   └── truncateText.js
├── services/
│   └── apiClient.js
## Final Folder Tree
```
src/
├── features/
│   ├── auth/           # Authentication logic, login forms, logout button
│   ├── cart/           # Shopping cart management, cart summary, checkout
│   ├── products/       # Product listing, product cards, product fetching
│   └── orders/         # Orders history, order cards, user dashboard
├── components/         # Shared UI components (Button, Modal, Spinner, etc.)
├── hooks/              # Shared custom React hooks (useDebounce, etc.)
├── utils/              # Pure utility functions (formatting, truncation)
├── services/           # Shared API client and base services
├── App.jsx             # Main routing and global state
├── main.jsx            # Application entry point
└── index.css           # Global styles and tailwind directives
```

## Folder Rules
- **src/features/**: Contains self-contained modules grouped by business feature. Each subfolder should contain its own components, hooks, and services that are specific to that feature.
  - *Test*: Is this file only used by one feature? If yes, it belongs here.
- **src/components/**: Contains shared UI components that are used across multiple features.
  - *Test*: Is this a generic UI element (like a Button or Modal) used in more than one feature? If yes, it belongs here.
- **src/hooks/**: Contains shared custom hooks that provide reusable logic across multiple features.
  - *Test*: Is this a hook that provides generic functionality (like debouncing or local storage sync) used in more than one feature? If yes, it belongs here.
- **src/utils/**: Contains pure, stateless helper functions.
  - *Test*: Is this a small function that only transforms data (like formatCurrency) and doesn't depend on React state? If yes, it belongs here.
- **src/services/**: Contains shared API clients or global service configurations.
  - *Test*: Does this configure how the app communicates with external APIs globally? If yes, it belongs here.

## Decision Tree
1. **Does it belong to one specific feature (auth / cart / products / orders)?**
   - Yes → Place in `src/features/[feature-name]/`
   - No → Go to question 2
2. **Is it a UI component?**
   - Yes → Place in `src/components/`
   - No → Go to question 3
3. **Is it a custom hook?**
   - Yes → Place in `src/hooks/`
   - No → Go to question 4
4. **Is it a pure utility function?**
   - Yes → Place in `src/utils/`
   - No → Place in `src/services/` (if it's an API client) or `src/` (if it's root configuration)

## Adding a New Feature
To add a new feature (e.g., "Wishlist"):
1. Create a new directory `src/features/wishlist/`.
2. Move/Create feature-specific components like `WishlistButton.jsx` or `WishlistPage.jsx` into this folder.
3. Add any wishlist-specific services or hooks to the same folder.
4. Import the main feature components into `App.jsx` for routing.
5. If the feature needs a shared component (like a common Button), use the existing one from `src/components/`.

## Before vs After
**Before**: The structure was completely flat, with 30+ files mixed in a single `src/` directory. Finding any specific logic required scanning a long list of filenames, and there was no clear separation between a "Button" (shared UI) and "CartSummary" (feature-specific logic).

**After**: The new feature-based architecture organizes code by business domain. If a developer needs to fix a bug in the shopping cart, they know exactly where to look: `src/features/cart/`. This structure reduces cognitive load, prevents naming collisions, and makes the codebase much easier to navigate for new engineers. For example, `cartService.js` is now logically grouped with `CartItem.jsx`, making the relationship between data and UI explicit.
