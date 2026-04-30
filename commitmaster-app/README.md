# 🎯 CommitMaster - AI Git Commit Message Generator

Generate professional, conventional commit messages in seconds using AI.

## 🎨 Problem

**Real Story:** As a developer, I spend 5-10 minutes writing commit messages. I either write vague "fix bug" messages because thinking is hard, or I struggle with the conventional commit format. Every commit feels like unnecessary overhead.

---

## ✨ Solution

**Input:** Paste your code changes or a brief description  
**AI Does:** Analyze the changes, understand the intent  
**Output:** 3 professional conventional commit messages ready to copy

Pick one and paste directly into your terminal. No more mental overhead.

---

## 🤖 AI Integration

**API:** OpenRouter  
**Model:** `openai/gpt-4o-mini`  
**Endpoint:** `POST /generate`  

**What the AI does:**
1. Reads your code changes
2. Determines change type (feat, fix, refactor, etc.)
3. Extracts scope (auth, api, db, etc.)
4. Generates 3 different conventional commit messages
5. Returns structured JSON

**File:** `backend/server.js` (lines 26-75)

---

## 📦 Project Structure

```
commitmaster-app/
├── backend/
│   ├── server.js           # Express + OpenRouter integration
│   ├── package.json        # Dependencies
│   ├── .env               # API keys (gitignored)
│   └── .env.example       # Setup template
├── frontend/
│   └── index.html         # Beautiful UI + logic
└── README.md
```

---

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Add your OPENROUTER_API_KEY
npm start
```

### 2. Serve Frontend

```bash
cd frontend
python -m http.server 8000
```

### 3. Open Browser

```
http://localhost:8000
```

---

## 📋 How It Works

### Frontend Flow
1. User pastes code changes
2. Clicks "Generate Commit Messages"
3. Frontend sends to backend
4. Shows 3 suggestions with copy buttons
5. User copies and pastes into git commit

### Backend Flow
```javascript
POST /generate
├─ Receive: { codeChanges: "..." }
├─ Build prompt with conventional commit rules
├─ Call OpenRouter API (gpt-4o-mini)
├─ Parse JSON response
└─ Return: { commits: [...] }
```

---

## 💡 Features

✅ **3 Suggestions** - Different perspectives on your changes  
✅ **Type Detection** - Automatically identifies feat/fix/refactor/etc  
✅ **Scope Extraction** - Suggests component/module affected  
✅ **One-Click Copy** - Copy to clipboard instantly  
✅ **Beautiful UI** - Modern gradient design, responsive  
✅ **Error Handling** - Graceful failures with helpful messages  
✅ **Production Ready** - Render + Netlify compatible  

---

## 🔧 What's Intentionally Excluded

### 1. **Message Body/Description**
**Why:** Most developers skip the body. The subject is 95% of value.

### 2. **Git Push Integration**
**Why:** Direct git execution from web is risky. Users copy and run manually = safer.

### 3. **Team Preferences/Custom Format**
**Why:** Scope creep. Keep it simple for 80% of use case first.

---

## 📊 Cost Analysis

**Per API Call:**
- Input tokens: ~200 (your code + prompt)
- Output tokens: ~150 (3 commit messages)
- Model: gpt-4o-mini @ $0.15 per 1M input, $0.60 per 1M output

**Calculation:**
- Input cost: (200 / 1M) × $0.15 = $0.00003
- Output cost: (150 / 1M) × $0.60 = $0.00009
- **Per call: ~$0.00012**

**Monthly (assuming 500 commits/month):**
- 500 calls × $0.00012 = **$0.06/month**
- Practically free ✅

**Scale to 10,000 commits:**
- 10,000 × $0.00012 = **$1.20/month**

---

## 🔒 Security

✅ API key stored server-side only (process.env)  
✅ Frontend has NO access to OpenRouter keys  
✅ All AI calls proxied through backend  
✅ CORS configured for frontend domain  

---

## 🚢 Deployment

### Backend (Render)

1. Push to GitHub
2. Connect repo to Render
3. Set environment variable: `OPENROUTER_API_KEY=sk-or-...`
4. Deploy Node.js service

### Frontend (Netlify)

1. Deploy `frontend/` folder as static site
2. Update `PRODUCTION_URL` in index.html
3. Deploy

---

## 📝 Example Usage

**Paste this:**
```
- Added password complexity validation
- Now requires 12+ chars, uppercase, numbers, special char
- Updated all tests
- Docs updated with new requirements
```

**Get these suggestions:**
```
✅ feat(auth): add password complexity validation
✅ refactor(auth): strengthen password requirements
✅ feat(security): implement strict password policy
```

---

## 🛠️ Customization

### Change Model
Edit `backend/server.js` line 45:
```javascript
model: 'openai/gpt-4o-mini'  // Change to any OpenRouter model
```

### Change Commit Styles
Edit system prompt in `server.js` (lines 26-40)

### Add Custom Scopes
Modify the prompt to include your team's conventions

---

## 📈 Future Ideas (Not Included)

- ❌ Multiple commit format styles (Angular, Gitmoji, etc)
- ❌ Team workspace with shared preferences
- ❌ Integration with GitHub/GitLab APIs
- ❌ VSCode extension
- ❌ Jira ticket linking

**Why excluded:** MVP focus - nail the core problem first.

---

## 🐛 Troubleshooting

**"Backend not reachable"**
- Check backend running: `npm start`
- Check CORS enabled for your frontend URL

**"Empty suggestions"**
- Paste more details about what changed
- Try: `git diff origin/main..HEAD | tail -50`

**"API Error"**
- Verify OPENROUTER_API_KEY is correct
- Check API quota not exceeded

---

## 📊 Performance

- Response time: 1-3 seconds
- Token usage: ~350 per call
- No rate limits at reasonable usage

---

## 👨‍💻 Built With

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JS
- **AI:** OpenRouter + GPT-4o-mini
- **Deployment:** Render (backend) + Netlify (frontend)

---

## 📄 License

MIT

---

**Status:** ✅ Production Ready  
**Deploy to:** Render + Netlify  
**Cost:** $0.06/month at scale

---

*Shipping real tools for real problems.* 🚀
