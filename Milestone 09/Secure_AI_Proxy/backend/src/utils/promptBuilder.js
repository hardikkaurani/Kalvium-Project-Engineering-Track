export function buildRiskAnalyzerPrompt(diff, context) {
  return {
    system: "You are an expert DevSecOps engineer. Your task is to analyze code diffs for security risks, performance issues, and clean code violations.",
    task: "Analyze the provided code diff within its context. Return a structured JSON response identifying any risks.",
    format: \Return strictly valid JSON matching exactly this schema:
{
  "riskLevel": "high" | "medium" | "low",
  "securityRisks": ["string"],
  "performanceIssues": ["string"],
  "cleanCodeSuggestions": ["string"],
  "confidence": "high" | "medium" | "low"
}\,
    constraints: "- Output ONLY JSON. No markdown blocks like \\\json.\n- Do not include conversational filler.\n- If there are no risks in a category, return an empty array [].",
    input: \Context: \\n\nDiff:\n\\
  };
}
