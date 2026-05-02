# Prompt Comparison Report

## Missing Components (Original Prompts)
### Task A (Notes Reviewer)
- **System Instruction**: Missing. Causes generic tone.
- **Context**: Missing. No delimiters.
- **Format**: Missing. Causes unstructured text.
- **Constraints**: Missing. Causes conversational filler.
- **Task**: Present but weak.

### Task B (Interview Summariser)
- **System Instruction**: Missing. Leads to generic summarization.
- **Context**: Missing. No clear boundary.
- **Format**: Missing. Fails to provide JSON.
- **Constraints**: Missing. Causes inclusion of personal names.
- **Task**: Present but weak.

### Task C (Error Analyst)
- **System Instruction**: Missing. Fails to set persona.
- **Context**: Missing. Stack trace not isolated.
- **Format**: Missing. Output is verbose text.
- **Constraints**: Missing. Severity is arbitrary text.
- **Task**: Present but weak.

## Improvement
- **Task A**: The original prompt lacked format and constraints, which caused inconsistent text output; the rewritten prompt's strict format produced a structured JSON object.
- **Task B**: The original prompt lacked constraints, which caused the inclusion of personal names; the rewritten prompt's constraints produced strict data types and anonymized data.
- **Task C**: The original prompt lacked constraints and format, which caused verbose conversational text; the rewritten prompt's strict constraints produced an exact enum match for severity.
