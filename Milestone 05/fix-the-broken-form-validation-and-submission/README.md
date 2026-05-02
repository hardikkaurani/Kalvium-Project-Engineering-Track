# TrackFlow — Fix the Broken Form Validation & Submission

## Challenge: Milestone 05

### 🎯 Objective

Fix all 6 critical bugs in the TrackFlow Bug Report Form (`src/App.jsx`) without changing UI layout or styling.

---

## 🐛 Bugs Found & Fixed

| # | Bug | Root Cause | Fix Applied |
|---|-----|-----------|-------------|
| 1 | Empty form submits successfully | No validation function | Created `validate(data)` — checks all 4 fields |
| 2 | Double-click sends multiple requests | No loading guard on submit | Added `disabled={loading}` + `setLoading(true)` before API call |
| 3 | Form doesn't reset after success | Missing form reset in success handler | `setForm({ ...EMPTY_FORM })` after successful submission |
| 4 | Server errors silently ignored | `catch` block only had `console.log` | Check `error.field` → field-level error, else → `setServerError()` |
| 5 | No field-level error messages | Missing `{errors.field && <p>}` in JSX | Added error `<p>` below every input with `field-error` class |
| 6 | Negative `stepsCount` accepted | No numeric validation | `validate()` checks `Number(val) > 0` and `Number.isInteger()` |

---

## 🏗️ Architecture

```
App.jsx (ONLY file changed)
├── validate(data)         ← NEW: Pure validation function
├── handleChange()         ← FIXED: Clears field error on input
├── handleSubmit()         ← FIXED: Full lifecycle with try/catch/finally
│   ├── validate → errors? STOP
│   ├── setLoading(true)
│   ├── try: submit → reset form
│   ├── catch: surface error to UI
│   └── finally: setLoading(false)
└── JSX                    ← FIXED: Error messages + disabled button
```

---

## ✅ Verification Checklist

- [x] Empty form → shows validation errors for all 4 fields
- [x] Double-click → only 1 request sent (button disabled during loading)
- [x] Title = "login" → shows field-level error from server
- [x] `stepsCount = -5` → rejected with error message
- [x] `stepsCount = 0` → rejected with error message
- [x] Successful submit → form resets to empty
- [x] Server error → visible error banner
- [x] Typing in field → clears that field's error
- [x] No UI/layout/CSS changes

---

## 🚀 Run Locally

```bash
cd "Milestone 05/fix-the-broken-form-validation-and-submission/TrackFlow"
npm install
npm run dev
```
