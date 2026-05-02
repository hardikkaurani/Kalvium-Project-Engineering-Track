# ShopWave Dashboard - Bug Investigation Report

## Bug #1 - Infinite Search Loop
**File:** `src/pages/ProductSearch.jsx`
**Lines:** 15-32

### Expected Behaviour
The search API should be called only when the user types a search query.

### Actual Behaviour
The browser tab freezes and thousands of API requests are fired per second as soon as the user enters the page or types one character.

### Root Cause
The `results` state was listed in the `useEffect` dependency array. Since `setResults` is called inside the effect itself, every successful API call would trigger a state change, which in turn would re-trigger the effect, creating an infinite recursive loop.

### Fix Applied
Removed `results` from the dependency array. Now the effect only runs when the `query` changes.

---

## Bug #2 - Search Race Condition & API Flooding
**File:** `src/pages/ProductSearch.jsx`
**Lines:** 21-42

### Expected Behaviour
The UI should reflect the results of the *latest* search query entered by the user.

### Actual Behaviour
Rapid typing causes overlapping API requests. If an earlier request (e.g., for "head") finishes *after* a later request (e.g., for "headphones"), the UI shows stale data that doesn't match the input field.

### Root Cause
There was no "debounce" mechanism or cleanup logic. Every single keystroke fired a new request, and there was no way to ignore the response of an outdated request.

### Fix Applied
Implemented a **400ms debounce** using `setTimeout` and `clearTimeout`. Also added an `isCurrent` flag inside the effect to ensure that only the results from the most recent request are saved to state.

---

## Bug #3 - Silent State Mutation in Order Manager
**File:** `src/pages/OrderManager.jsx`
**Lines:** 39-48

### Expected Behaviour
When an order status is updated via the dropdown, the colored status badge in the table should update immediately to match.

### Actual Behaviour
The API call succeeds (database updates), but the UI badge stays on the old status until the page is refreshed.

### Root Cause
The code was mutating the state directly: `const updatedOrders = orders; updatedOrders.find(...).status = newStatus;`. Since arrays are objects passed by reference, `setOrders(updatedOrders)` was passing the *same* memory address as the existing state. React's reconciliation engine sees that the reference hasn't changed and skips the re-render.

### Fix Applied
Implemented an **immutable update** pattern using `.map()`. This creates a brand new array and a new object for the modified order, signaling to React that a re-render is required.
