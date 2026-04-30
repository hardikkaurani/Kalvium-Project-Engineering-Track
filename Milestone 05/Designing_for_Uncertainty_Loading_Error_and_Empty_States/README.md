# ShopDash — Designing for Uncertainty: Loading, Error & Empty States

## Challenge: Milestone 05 — Challenge 6

### 🎯 Objective

Implement a production-quality, reusable state management system for all data-fetching screens in a React e-commerce dashboard. Every screen follows the exact **4-state pattern**: Loading → Error → Empty → Data.

---

## 🏗️ Architecture

```
src/
├── components/
│   └── states/
│       ├── SkeletonCard.jsx     ← Reusable skeleton loading
│       ├── ErrorMessage.jsx     ← Reusable error with retry
│       ├── EmptyState.jsx       ← Reusable empty with CTA
│       └── index.js             ← Barrel export
├── hooks/
│   └── useFetch.js              ← Generic data-fetching hook
├── pages/
│   ├── Dashboard.jsx            ← 4-state ✓
│   ├── Orders.jsx               ← 4-state ✓
│   ├── Products.jsx             ← 4-state ✓
│   └── Customers.jsx            ← 4-state ✓
├── services/
│   └── api.js                   ← Simulated API with fail/empty modes
├── App.jsx                      ← Sidebar + routing
└── main.jsx
```

---

## 📦 Reusable Components

### SkeletonCard
- **Props**: `count` (number)
- Renders multiple shimmer-animated skeleton cards
- Matches real card layout

### ErrorMessage
- **Props**: `message` (string), `onRetry` (function, optional)
- SVG warning icon + user-friendly message
- Retry button only when `onRetry` is provided

### EmptyState
- **Props**: `title`, `message`, `actionLabel` (optional), `onAction` (optional)
- SVG empty box icon + configurable CTA

---

## 🔄 4-State Pattern (Every Screen)

```jsx
if (isLoading) return <SkeletonCard count={6} />;
if (error) return <ErrorMessage message={error} onRetry={refetch} />;
if (data.length === 0) return <EmptyState title="..." message="..." />;
return <ActualDataUI />;
```

---

## ✅ Verification

- [x] Dashboard: Loading → Error → Empty → Data
- [x] Orders: Loading → Error → Empty → Data
- [x] Products: Loading → Error → Empty → Data
- [x] Customers: Loading → Error → Empty → Data
- [x] Components are fully reusable (not hardcoded)
- [x] Retry button triggers refetch
- [x] Skeleton animation uses Tailwind shimmer
- [x] Clean, minimal, production-quality code

---

## 🚀 Run Locally

```bash
cd "Milestone 05/Designing_for_Uncertainty_Loading_Error_and_Empty_States/ShopDash"
npm install
npm run dev
```
