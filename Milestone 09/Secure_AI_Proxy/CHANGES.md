# Security Audit: API Key Exposure Fix

## Before
- **File**: `src/App.jsx`
- **Line**: 10 (approx)
- **Exposure**: The OpenAI API key was stored in a variable starting with `VITE_` (`VITE_OPENAI_API_KEY`).
- **Explanation**: In Vite projects, variables prefixed with `VITE_` are automatically bundled into the production JavaScript sent to the browser. This means anyone can open DevTools, look at the network requests or the JS source, and find the `sk-` key in plain text.

## After
- **Architecture Change**: All direct calls to `api.openai.com` have been removed from the frontend.
- **Backend Proxy**: Created a new backend route `POST /api/summarize` and a dedicated `aiService.js`.
- **Security**: The API key is now stored in the backend's environment variables (`process.env.OPENAI_API_KEY`). It never leaves the server.
- **No Frontend Exposure**: The frontend now sends the notes to our own server, which performs the AI call and returns only the result.

## Risk
**Billing Abuse**: An attacker could steal the exposed API key and use it to fund their own AI projects, potentially costing the owner thousands of dollars in usage fees before being detected.

## Verification
- **Network Tab**: Confirmed that only `/api/summarize` is called; no requests to `api.openai.com`.
- **Authorization Headers**: No `Bearer sk-...` tokens visible in the browser request headers.
- **Grep Check**: `grep -rn "openai\|OPENAI\|api\.openai\|Bearer sk-" src/` returns 0 matches.
