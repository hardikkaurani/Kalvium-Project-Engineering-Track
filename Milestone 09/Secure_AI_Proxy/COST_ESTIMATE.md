# Cost Estimate: Diff Risk Analyzer

## Token Usage Table (5 Sample Calls)

| Call | Diff Length | Context Length | Prompt Tokens | Completion Tokens | Total Tokens |
|------|-------------|----------------|---------------|-------------------|--------------|
| 1    | 50 lines    | 20 words       | ~280          | ~60               | ~340         |
| 2    | 120 lines   | 30 words       | ~550          | ~80               | ~630         |
| 3    | 300 lines   | 50 words       | ~1200         | ~110              | ~1310        |
| 4    | 450 lines   | 80 words       | ~1800         | ~150              | ~1950        |
| 5    | 10 lines    | 10 words       | ~150          | ~40               | ~190         |

**Averages:**
- Prompt Tokens: 796
- Completion Tokens: 88

## Model Pricing

**openai/gpt-4o-mini:**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

## Cost Projection

**Formula:**
cost_per_request = (promptTokens * input_price / 1,000,000) + (completionTokens * output_price / 1,000,000)

**Cost per average request:**
- Input cost: 796 * 0.15 / 1,000,000 = .0001194
- Output cost: 88 * 0.60 / 1,000,000 = .0000528
- **Total:** $0.0001722

**Projections:**
- **Daily cost (100 users * 5 calls = 500 requests):** 500 * .0001722 = .0861
- **Monthly cost (100 users for 30 days):** $0.0861 * 30 = .58

## Rate Limit Justification
The rate limit is set to 5 requests per minute per user. This prevents any single user from exhausting the API budget via automated scripts while providing ample usage for a human developer submitting PR diffs for analysis. At 5 requests per minute, a malicious user can at most cost us $0.05 per hour.
