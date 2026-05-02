# Code Diff Risk Analyzer

## Personal Problem
When reviewing complex pull requests, I often miss subtle security or performance issues hidden in dense, boilerplate-heavy code diffs. This leads to tech debt and potential security vulnerabilities slipping into production.

## Input/Output Schema
**Input:**
\\\json
{
  "diff": "string (the git diff)",
  "context": "string (description of the feature)"
}
\\\

**Output:**
\\\json
{
  "riskLevel": "high" | "medium" | "low",
  "securityRisks": ["string"],
  "performanceIssues": ["string"],
  "cleanCodeSuggestions": ["string"],
  "confidence": "high" | "medium" | "low"
}
\\\

## Model Choice
**Model:** \gpt-4o-mini\
**Justification:** This model provides excellent structured JSON adherence and coding knowledge while costing a fraction of \gpt-4o\. Since diff analysis can involve thousands of input tokens, using a mini model is critical for keeping costs under /month.

## Rate Limit Reasoning
The limit is strictly **5 requests per minute per user**. Human code review is a slow process; a developer shouldn't need to analyze more than 5 diffs per minute. This effectively prevents cost-exhaustion attacks where malicious users automate thousands of requests.

## Cost Summary
At 500 requests per day (100 users averaging 5 calls), the cost is extremely minimal at **~.58 per month**.
