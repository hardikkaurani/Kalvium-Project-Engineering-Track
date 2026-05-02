# Cost Estimate and AI Usage Analysis

## Token Usage Table

| Call | Note Length | Prompt Tokens | Completion Tokens | Total Tokens |
|------|-------------|---------------|-------------------|--------------|
| 1    | 200 words   | 275           | 50                | 325          |
| 2    | 500 words   | 665           | 80                | 745          |
| 3    | 800 words   | 1055          | 120               | 1175         |
| 4    | 1000 words  | 1315          | 150               | 1465         |
| 5    | 50 words    | 80            | 20                | 100          |

**Averages:**
- Average Prompt Tokens: 678
- Average Completion Tokens: 84

## Model Pricing

**openai/gpt-4o-mini:**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**openai/gpt-4o (Expensive alternative):**
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens

## Cost Projection

**Formula:**
cost_per_request = (promptTokens * input_price / 1,000,000) + (completionTokens * output_price / 1,000,000)

**Cost per average request (gpt-4o-mini):**
- Input cost: 678 * 0.15 / 1,000,000 = .0001017
- Output cost: 84 * 0.60 / 1,000,000 = .0000504
- **Total:** $0.0001521

**Projections:**
- **Daily cost (10 users * 5 calls = 50 requests):** 50 * .0001521 = .007605
- **Daily cost (100 users * 5 calls = 500 requests):** 500 * .0001521 = .07605
- **Monthly cost (100 users for 30 days):** $0.07605 * 30 = .28

## Recommendation

I recommend using openai/gpt-4o-mini since it fulfills our summarization needs reliably at an estimated monthly cost of just .28 for 100 active users. Upgrading to gpt-4o would unnecessarily increase our monthly costs by over 16x (to roughly .00/month) without providing a proportional increase in summarization quality.

## Token Verification

When testing with a 200-word note, the base text is roughly 260 tokens (using the standard 1 token ˜ 0.75 words ratio). However, our logs show promptTokens: 275. This difference of ~15 tokens exactly matches the length of our hidden system prompt ("You are a concise study note summariser. Return a bullet-point summary of the key concepts.") which is prepended to every request.
