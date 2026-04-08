# AI Chatbot - Frontend

Full-stack AI chatbot application with Express backend and vanilla JavaScript frontend.

## Features
- Real-time chat interface
- Clean dark UI
- Integration with AI API (OpenRouter/Gemini)
- Responsive design
- Message history

## Setup

### Backend Setup
1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example`
4. Add your OpenRouter API key
5. Start server: `npm start`

### Frontend Setup
1. Open `frontend/index.html` in a web browser
2. Or serve via HTTP server for better performance

## Project Structure

```
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json       # Dependencies
│   └── .env.example       # Environment template
├── frontend/
│   ├── index.html         # Chat UI HTML
│   ├── style.css          # Chat styling
│   └── script.js          # Chat functionality
└── README.md
```

## API Endpoints

### POST /chat
Send a message to the AI

**Request:**
```json
{
  "message": "What is Node.js?"
}
```

**Response:**
```json
{
  "message": "AI response here",
  "timestamp": "2026-04-09T10:00:00Z"
}
```

## Technologies
- **Backend:** Node.js, Express, Axios
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **AI API:** OpenRouter or Gemini
