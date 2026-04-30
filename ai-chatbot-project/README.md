# 🤖 AI Chatbot - Production Ready

A secure, production-ready AI chatbot with Node.js backend and vanilla JavaScript frontend.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│           Frontend (index.html)                      │
│  - Chat UI (HTML/CSS/JS)                            │
│  - Message history in memory                        │
│  - NO API keys exposed                              │
└──────────────┬──────────────────────────────────────┘
               │ HTTPS /chat (messages array)
               ↓
┌─────────────────────────────────────────────────────┐
│           Backend (Express.js)                       │
│  - POST /chat → OpenRouter API                      │
│  - Fallback: Gemini API                             │
│  - Full message context sent                        │
│  - API keys secure in .env                          │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
    ┌──────────────────────────────┐
    │  OpenRouter (Primary)        │
    │  Model: gpt-4o-mini          │
    └──────────────────────────────┘
```

## 🔒 Security Features

### Why Backend Instead of Frontend?

**Frontend OpenRouter Call (❌ VULNERABLE):**
```javascript
// BAD - DevTools exposes API key
fetch('https://openrouter.ai/api/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}` }
})
```
**Risk:** Anyone can inspect browser DevTools → steal API key → unlimited API costs

**Backend Proxy (✅ SECURE):**
```javascript
// GOOD - API key hidden server-side
app.post('/chat', async (req, res) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
  })
})
```
**Benefits:**
- API keys never sent to frontend
- Only internal backend↔OpenRouter communication
- No risk of key exposure via DevTools
- Rate limiting on backend
- Full message context control

## 📋 Requirements

- Node.js 14+
- npm or yarn
- OpenRouter API key (get from: https://openrouter.ai/keys)
- Optional: Gemini API key for fallback

## 🚀 Setup & Deployment

### Local Development

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
# Add your OPENROUTER_API_KEY
```

3. **Start backend:**
```bash
npm start  # or npm run dev for nodemon
```

4. **Serve frontend:**
```bash
# Simple Python
cd ../frontend
python -m http.server 8000

# Or use Live Server in VS Code
```

5. **Open:** `http://localhost:8000`

### Production Deployment

#### Backend (Render)

1. Connect GitHub repo to Render
2. Set environment variables:
   - `OPENROUTER_API_KEY=sk-or-v1-...`
   - `NODE_ENV=production`
   - `REFERER_URL=https://your-frontend-url.com`
3. Deploy Node.js service

#### Frontend (Netlify)

1. Connect GitHub repo to Netlify
2. Build command: `(none - static files)`
3. Publish directory: `frontend`
4. Update `PRODUCTION_BACKEND_URL` in `frontend/index.html`
5. Deploy

## 📡 API Endpoints

### `POST /chat`
Send messages and get AI response

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "How are you?" }
  ]
}
```

**Response:**
```json
{
  "reply": "I'm doing great, thanks for asking!"
}
```

### `GET /health`
Health check

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-04-27T10:30:00Z"
}
```

### `GET /history`
Retrieve conversation history

**Response:**
```json
{
  "history": [...]
}
```

### `POST /reset`
Clear conversation

**Response:**
```json
{
  "message": "Conversation reset"
}
```

## 🎛️ Configuration

### OpenRouter Models

Current: `openai/gpt-4o-mini` (fast, cheap)

Available options:
- `openai/gpt-4-turbo` (powerful)
- `meta-llama/llama-2-70b-chat` (open source)
- See all: https://openrouter.ai/docs/models

Change in `backend/server.js` line 47:
```javascript
model: 'openai/gpt-4o-mini'  // Change this
```

### Fallback to Gemini

If OpenRouter fails and `GEMINI_API_KEY` is set, automatically uses Gemini API.

To disable fallback, remove `callGeminiAPI()` function from `server.js`.

## 📦 Conversation Context

**How it works:**
1. Frontend maintains `messages` array
2. On send: push user message
3. Send FULL array to backend
4. Backend sends full history to OpenRouter
5. Receive AI response
6. Push assistant message to array
7. Next turn: repeat with extended history

**Max tokens:** 1000 per response

For longer conversations, implement:
- Token counting
- Message summarization
- Sliding window (keep last N messages)
- Database storage

## 🔄 Model Switching

### From OpenRouter to Gemini

Change `backend/server.js`:
```javascript
// Replace the OpenRouter section with:
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    }),
  }
);
```

## 📊 Cost Estimation

| Model | Cost | Speed | Quality |
|-------|------|-------|---------|
| gpt-4o-mini | $0.15/1M tokens | ⚡ Fast | ✅ Good |
| gpt-4-turbo | $0.03/1K prompt | 🟡 Medium | ✅✅ Excellent |
| Llama 2 70B | $0.70/1M tokens | ⚡ Very Fast | ✅ Good |
| Gemini | Free tier available | ⚡ Fast | ✅ Good |

## 🐛 Troubleshooting

### "API configuration error"
- Check `.env` file has `OPENROUTER_API_KEY`
- Ensure key format: `sk-or-v1-...`

### "Failed to get AI response"
- Check OpenRouter account has credits
- Verify API key is valid
- Check rate limits

### "Backend not reachable"
- Backend not running? Start with `npm start`
- CORS issue? Check `REFERER_URL`
- Wrong URL? Update `PRODUCTION_BACKEND_URL` in frontend

### Slow responses
- Model too powerful? Switch to `gpt-4o-mini`
- High traffic? Add caching or queue system

## 📈 Production Checklist

- [ ] Environment variables set on production
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured for frontend domain
- [ ] Rate limiting implemented
- [ ] Error logging enabled
- [ ] Database instead of in-memory storage
- [ ] Conversation history limits set
- [ ] API key rotation schedule

## 🔗 Deployment URLs

**Backend (Render):** `https://ai-chatbot-backend.onrender.com`  
**Frontend (Netlify):** `https://ai-chatbot-app.netlify.app`

Update these in deployment configs.

## 📝 License

MIT

## 👨‍💻 Author

Built with security and production-readiness in mind.

---

**Ready to deploy!** 🚀
