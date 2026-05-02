# AI API Guardrails

## Guardrail 1 — Input Length Validation
- **What added:** A check in the \index.js\ controller that rejects any notes text exceeding 3,000 characters and immediately returns a 400 Bad Request status.
- **What it protects:** Prevents enormous payloads from being sent to the AI model, which safeguards against token limit exhaustion, unexpected high billing costs, and deliberate DoS (Denial of Service) attacks aimed at our API budget.
- **Production incident prevented:** Sending 5000+ characters of garbage text that succeeds on our server but wastes AI tokens and causes out-of-memory or timeout errors downstream.

## Guardrail 2 — Request Timeout
- **What added:** An \AbortController\ wrapper around the AI \etch\ request with a strict 15-second timeout limit. If the AI service takes too long, the request is aborted and a fallback response is served.
- **What it protects:** Prevents our Node.js server connections from hanging indefinitely when the AI provider experiences severe latency or outages.
- **Production incident prevented:** Complete server lockup due to thread/connection exhaustion when 100+ users attempt to hit a lagging AI endpoint simultaneously.

## Guardrail 3 — LLM Failure Handling
- **What added:** A comprehensive \	ry...catch\ block that gracefully traps any AI service errors (like 401 Unauthorized, 500 Server Error from OpenAI, or network failures). It logs the exact error as \[AI_ERROR]\ and returns a fallback JSON response. The controller then responds with a 503 Service Unavailable instead of crashing.
- **What it protects:** Prevents unhandled promise rejections or raw stack traces from crashing the main Node.js process and ensures the client gets a clean, readable error rather than a broken connection.
- **Production incident prevented:** Total application crash (bringing down the \/api/health\ endpoint as well) simply because an API key expired or the AI provider went down.
