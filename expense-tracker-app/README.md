# 💰 Expense Tracker

A simple, no-nonsense app to track your daily expenses and understand where your money goes.

## 🎯 What It Is

Track daily spending with a clean interface. Add, edit, delete expenses. See total spending and average per entry.

## 📋 Problem It Solves

**Real story:** I have no idea where my money goes each month. I'd spend mindlessly and then wonder why my bank account is low. By logging each expense, I see patterns and can control spending better.

## ✨ Features

✅ **Create** - Add expenses with title, amount, category, date  
✅ **Read** - View all expenses sorted by date  
✅ **Update** - Edit any expense  
✅ **Delete** - Remove expenses  
✅ **Summary** - See total spent, average per entry, entry count  
✅ **Categories** - Organize by food, transport, entertainment, etc.  

## 🚫 What's Intentionally Excluded

| Feature | Why Excluded |
|---------|-------------|
| **User Authentication** | Single-user app for personal use. Adds complexity not needed for MVP. |
| **Data Export (CSV/PDF)** | Can be added later. Focus on core CRUD first. |
| **Monthly Budget Limits** | Scope creep. Just track spending first. |
| **Recurring Expenses** | Most expenses are one-time. Adds UI complexity. |
| **Cloud Sync** | Local SQLite is enough for personal use. |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express |
| **Database** | SQLite (better-sqlite3) |
| **Frontend** | HTML + CSS + Vanilla JavaScript |
| **API** | RESTful (4 CRUD routes + health) |

## 📦 Project Structure

```
expense-tracker-app/
├── backend/
│   ├── server.js          # Express server + API routes
│   ├── db.js             # SQLite database
│   ├── package.json      # Dependencies
│   ├── .env              # Configuration
│   └── .env.example      # Template
├── frontend/
│   ├── index.html        # HTML structure
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
└── README.md
```

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:3000`

### Frontend

```bash
cd frontend
# Serve with any static server
python -m http.server 8000
```

Open `http://localhost:8000`

## 📡 API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| **POST** | `/items` | Create expense |
| **GET** | `/items` | Get all expenses |
| **PUT** | `/items/:id` | Update expense |
| **DELETE** | `/items/:id` | Delete expense |
| **GET** | `/health` | Health check |

### Example Request

```json
POST /items
{
  "title": "Coffee",
  "amount": 50.00,
  "category": "Food",
  "date": "2026-04-28"
}
```

## 🧪 Test Flow

1. **Add expense** - Fill form, click "Add Expense"
2. **Refresh page** - Expense still there (DB working ✅)
3. **Edit expense** - Click "Edit", modify, click "Update"
4. **Delete expense** - Click "Delete", confirm
5. **See summary** - Total, average, count shown

## 💻 Frontend + Backend URLs

**Local Development:**
- Frontend: `http://localhost:8000`
- Backend: `http://localhost:3000`

**Production (Render + Netlify):**
- Frontend: `https://expense-tracker-app.netlify.app`
- Backend: `https://expense-tracker-backend.onrender.com`

Update `const PRODUCTION_URL` in `frontend/script.js` when deploying.

## 📊 Database Schema

```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🚢 Deployment

### Backend (Render)

1. Push repo to GitHub
2. Create new Node.js service on Render
3. Set `PORT=3000`
4. Deploy

### Frontend (Netlify)

1. Push repo to GitHub
2. Connect `frontend` folder to Netlify
3. Deploy

## ✅ Checklist

- ✅ All 4 CRUD routes working
- ✅ Health check endpoint
- ✅ SQLite database with schema
- ✅ Error handling
- ✅ CORS enabled
- ✅ Environment variables
- ✅ Beautiful UI
- ✅ Responsive design
- ✅ Form validation
- ✅ No unnecessary complexity

---

**Status:** ✅ Production Ready  
**Built with:** Node.js + Express + SQLite + Vanilla JS  
**Deployment:** Render (backend) + Netlify (frontend)
