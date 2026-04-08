# Dev Confessions API

A backend Express API for sharing and managing developer confessions and experiences.

## Features
- Create confessions
- Retrieve all confessions
- Get confession by ID
- Filter confessions by category
- Delete confessions
- MVC Architecture

## API Endpoints

### Base URL: `/api/confessions`

- `GET /` - Get all confessions
- `POST /` - Create a new confession
- `GET /:id` - Get confession by ID
- `GET /category/:cat` - Get confessions by category
- `DELETE /:id` - Delete a confession

## Project Structure

```
├── app.js                 # Express server setup
├── index.js              # Server entry point
├── package.json          # Dependencies
├── controllers/          # Business logic
│   └── confessionController.js
├── routes/              # API routes
│   └── confessionRoutes.js
├── services/            # Data layer
│   └── confessionService.js
├── .env.example         # Environment variables template
├── README.md            # This file
├── AUDIT.md             # Code audit
└── CHANGES.md           # Changelog
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update values
4. Start the server: `npm start`

## Development

Run with auto-reload:
```bash
npm run dev
```

## Architecture

This project follows the **MVC (Model-View-Controller)** pattern:

- **Controllers**: Handle HTTP request/response logic
- **Routes**: Define API endpoints
- **Services**: Contain business logic and data operations
