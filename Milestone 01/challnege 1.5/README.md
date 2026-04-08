# Prompt Token Audit Challenge

## Overview
This challenge focuses on optimizing AI prompts by auditing token usage and finding inefficiencies in system prompts.

## Objective
Analyze the `prompts/system-prompt.txt` file and identify areas where tokens are being wasted. Optimize the prompt while maintaining its effectiveness.

## What is Token Audit?
An audit of an AI system prompt to:
- Count total tokens used
- Identify redundant or unnecessary text
- Find verbose explanations that can be condensed
- Optimize for cost and latency
- Maintain quality and clarity

## Challenge Tasks

### 1. Analyze Current Prompt
- Read `prompts/system-prompt.txt`
- Count tokens (use OpenRouter API token counter or estimate)
- Document current token count

### 2. Identify Inefficiencies
Find and list:
- Redundant instructions
- Repetitive information
- Unnecessarily long explanations
- Unused or unclear guidelines

### 3. Optimize Prompt
- Rewrite system prompt to reduce tokens by 15-25%
- Maintain or improve clarity
- Preserve all essential instructions

### 4. Document Changes
- Update `token-audit.md` with:
  - Original token count
  - New token count
  - Changes made
  - Rationale for each change
  - Token savings percentage

## Project Structure

```
├── src/
│   ├── index.js          # Express server & /review endpoint
│   └── callAI.js         # AI API integration
├── prompts/
│   └── system-prompt.txt # System prompt to audit
├── sample-inputs/
│   └── sample-code.js    # Test data for API
├── token-audit.md        # Audit results & optimization
├── package.json
├── .env.example
└── README.md
```

## API Endpoint

### POST /review
Send code for AI review using the optimized prompt

**Request:**
```json
{
  "code": "// your code here"
}
```

**Response:**
```json
{
  "review": "AI review response",
  "tokens_used": 150
}
```

## Deliverables
1. ✅ Optimized `prompts/system-prompt.txt`
2. ✅ Completed `token-audit.md` with detailed analysis
3. ✅ Working `/review` endpoint integration

## Token Counting Tools
- OpenRouter API has built-in token counter
- tiktoken library (Python)
- Manual character-to-token estimation (~4 chars ≈ 1 token)

## Success Criteria
- [ ] Reduce token count by 15-25%
- [ ] Maintain prompt effectiveness
- [ ] Document all changes
- [ ] API endpoint working
- [ ] Clear audit trail

## Resources
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Token Estimation Guide](https://platform.openai.com/tokenizer)
- [Prompt Optimization Best Practices](https://openrouter.ai/docs/guides/production-best-practices)
