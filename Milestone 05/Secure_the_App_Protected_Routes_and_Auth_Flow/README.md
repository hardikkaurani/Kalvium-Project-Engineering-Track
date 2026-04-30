# VaultApp — Secure the App: Protected Routes & Auth Flow

## Challenge: Milestone 05

### 🎯 Objective

Fix a broken authentication system in VaultApp. The app had 5 critical auth bugs that allowed unauthenticated access, lost login state on refresh, and had a non-reactive navbar.

---

## 🐛 Bugs Found & Fixed

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | Unauthenticated users can access /dashboard, /settings, /profile | No ProtectedRoute component, routes are completely public | Created `ProtectedRoute.jsx` — checks `isAuthenticated`, redirects to `/login` |
| 2 | Login state lost after refresh | `login()` never saves to `localStorage` | Added `localStorage.setItem()` in `login()` |
| 3 | `logout()` doesn't clear storage | Only clears React state, not `localStorage` | Added `localStorage.removeItem()` in `logout()` |
| 4 | No `isAuthenticated` in context | Context only exposes `user` and `token` | Added `isAuthenticated = !!token` derived value |
| 5 | Navbar always shows "Login" | Not using `useAuth()` — hardcoded login button | Made Navbar reactive — shows user + logout when authenticated |

---

## 🏗️ Architecture (Step-by-Step Fix Order)

```
Step 1: AuthContext.jsx
  ├── Added useEffect to load from localStorage on mount
  ├── login() → saves to state + localStorage
  ├── logout() → clears state + localStorage
  └── isAuthenticated = !!token (derived)

Step 2: ProtectedRoute.jsx (NEW)
  ├── Uses useAuth().isAuthenticated
  └── Not authenticated → Navigate to /login with replace

Step 3: App.jsx
  └── Wrapped /dashboard, /settings, /profile in ProtectedRoute

Step 4: Navbar.jsx
  ├── Shows Dashboard/Profile/Settings + Username + Logout when authenticated
  └── Shows Login button when not authenticated
```

---

## ✅ Verification Checklist

- [x] Direct access to /dashboard → redirects to /login
- [x] Direct access to /settings → redirects to /login
- [x] Direct access to /profile → redirects to /login
- [x] Login with admin@vault.com / admin123 → dashboard loads
- [x] Refresh page → still logged in (localStorage persistence)
- [x] Navbar shows username + Logout after login
- [x] Logout → clears auth + redirects to /login
- [x] Access protected routes after logout → blocked
- [x] Navbar shows Login button after logout

---

## 🚀 Run Locally

```bash
cd "Milestone 05/Secure_the_App_Protected_Routes_and_Auth_Flow/VaultApp"
npm install
npm run dev
```

**Demo credentials:** admin@vault.com / admin123
