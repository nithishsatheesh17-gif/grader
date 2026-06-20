"""
Gemini prompt builder and response parser for ClearGrade.
Handles constructing the evaluation prompt and parsing the JSON response.
"""

import json
import os
import google.generativeai as genai
from typing import List
from models import Criterion, CriterionResult

# ── Configure Gemini ──────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"


def build_prompt(rubric: List[Criterion], essay: str) -> str:
    """
    Construct the evaluation prompt for Gemini.
    
    The prompt instructs the model to act as a strict academic evaluator,
    score each criterion, and return ONLY valid JSON.
    """
    rubric_text = "\n".join(
        f"  - {c.name}: {c.max_marks} marks" for c in rubric
    )

    return f"""You are an academic evaluator. You must evaluate the following student submission against the provided rubric.

RUBRIC:
{rubric_text}

STUDENT SUBMISSION:
\"\"\"
{essay}
\"\"\"

INSTRUCTIONS:
1. Score each criterion out of its maximum marks. Be strict but fair.
2. Provide specific, actionable feedback for each criterion.
3. Return ONLY a valid JSON array — no markdown, no explanation, no code fences.

REQUIRED FORMAT (return ONLY this JSON array, nothing else):
[
  {{
    "criterion": "<criterion name>",
    "score": <number>,
    "max_score": <max marks>,
    "feedback": "<specific feedback>"
  }}
]

Return the JSON array now:"""


def parse_gemini_response(raw: str, rubric: List[Criterion]) -> List[CriterionResult]:
    """
    Parse Gemini's raw text response into structured CriterionResult objects.
    Handles common formatting issues (markdown fences, extra text).
    """
    text = raw.strip()

    # Strip markdown code fences if present
    if text.startswith("```"):
        # Remove opening fence (```json or ```)
        first_newline = text.index("\n")
        text = text[first_newline + 1:]
    if text.endswith("```"):
        text = text[:-3].strip()

    # Try to extract JSON array from the response
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError("No JSON array found in Gemini response")

    json_str = text[start:end + 1]
    data = json.loads(json_str)

    if not isinstance(data, list):
        raise ValueError("Gemini response is not a JSON array")

    results = []
    for item in data:
        results.append(CriterionResult(
            criterion=str(item.get("criterion", "Unknown")),
            score=float(item.get("score", 0)),
            max_score=float(item.get("max_score", 0)),
            feedback=str(item.get("feedback", "No feedback provided"))
        ))

    return results


async def evaluate_with_gemini(rubric: List[Criterion], essay: str) -> List[CriterionResult]:
    """
    Send the evaluation prompt to Gemini and return parsed results.
    Retries once on malformed response.
    """
    model = genai.GenerativeModel(MODEL_NAME)
    prompt = build_prompt(rubric, essay)

    # Attempt 1
    try:
        response = model.generate_content(prompt)
        return parse_gemini_response(response.text, rubric)
    except (json.JSONDecodeError, ValueError, KeyError):
        pass  # Fall through to retry

    # Attempt 2 (retry once)
    try:
        response = model.generate_content(prompt)
        return parse_gemini_response(response.text, rubric)
    except (json.JSONDecodeError, ValueError, KeyError) as e:
        raise RuntimeError(
            f"Gemini returned a malformed response after 2 attempts: {str(e)}"
        )
