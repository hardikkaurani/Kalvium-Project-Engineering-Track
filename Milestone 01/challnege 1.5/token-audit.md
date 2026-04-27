# Token Audit Report

## Objective
Reduce prompt tokens without removing any instruction.

## Files
- `prompts/system-prompt.txt` — rewritten system prompt
- `src/callAI.js` — token usage and cost logging

## Token counts

Estimated with a simple regex-based token heuristic.

| Version | Token count | Character count | Reduction |
|---|---:|---:|---:|
| Original | 191 | 1,121 | — |
| New | 104 | 523 | 45.5% |

## 3 token-waste sources

| Pattern | Location | Explanation |
|---|---|---|
| Repeated review framing | Opening paragraph + closing paragraph | The prompt says “expert code reviewer,” “technical feedback,” “thorough,” “constructive,” “best practices,” and “improve” in multiple places. One compact framing is enough. |
| Duplicated checklist language | Numbered list items 1-10 | Several items overlap semantically, such as performance vs optimization opportunities, readability vs maintainability, and code quality vs architecture. Grouping them cuts repeated setup text. |
| Verbose output guidance | “For each review, provide…” section | The output requirements are written as full sentences with extra filler. A short bulleted list conveys the same required response structure with fewer tokens. |

## Rewritten prompt impact

| Metric | Original | New | Delta |
|---|---:|---:|---:|
| Prompt tokens | 191 | 104 | -87 |
| Prompt token cost/call* | $0.000096 | $0.000052 | -$0.000044 |
| Monthly prompt cost at 90,000 calls* | $8.60 | $4.68 | -$3.92 |

*Estimated with $0.0005 / 1K prompt tokens.

## Cost comparison table

| Scenario | Prompt tokens/call | Cost/call | Cost for 90,000 calls |
|---|---:|---:|---:|
| Original prompt | 191 | $0.000096 | $8.60 |
| Optimized prompt | 104 | $0.000052 | $4.68 |
| Savings | 87 | $0.000044 | $3.92 |

## Monthly cost calculation

- Calls per month: 90,000
- Prompt token savings per call: 87
- Rate used: $0.0005 per 1K prompt tokens
- Monthly savings: $(87 / 1000) × 0.0005 × 90,000 = $3.92$

## Notes
- The prompt keeps every original instruction; only wording was compressed.
- The app now logs `prompt_tokens`, `completion_tokens`, `total_tokens`, and estimated cost after each API response.
