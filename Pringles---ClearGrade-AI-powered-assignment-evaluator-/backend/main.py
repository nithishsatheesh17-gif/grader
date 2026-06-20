"""
ClearGrade Backend — FastAPI server with a single /evaluate endpoint.
Accepts a rubric + essay, evaluates via Gemini, returns scored criteria.
"""

import os
from dotenv import load_dotenv

# Load .env before any other imports that need GEMINI_API_KEY
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import EvaluationRequest, EvaluationResponse
from prompt import evaluate_with_gemini

# ── App setup ─────────────────────────────────────────────────────
app = FastAPI(
    title="ClearGrade API",
    description="AI-powered assignment evaluator using Gemini",
    version="1.0.0",
)

# ── CORS — allow the React frontend to talk to us ────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Dev: allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ──────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "ok", "service": "ClearGrade API"}


# ── Main evaluation endpoint ─────────────────────────────────────
@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(request: EvaluationRequest):
    """
    Evaluate a student submission against a rubric.
    
    Accepts:
      - rubric: list of { name, max_marks }
      - essay: string
    
    Returns:
      - results: list of { criterion, score, max_score, feedback }
      - total_score, total_max_score
    """
    # ── Validate inputs ───────────────────────────────────────────
    if not request.essay.strip():
        raise HTTPException(status_code=400, detail="Essay text cannot be empty.")

    if not request.rubric:
        raise HTTPException(status_code=400, detail="Rubric must have at least one criterion.")

    for criterion in request.rubric:
        if not criterion.name.strip():
            raise HTTPException(status_code=400, detail="Each criterion must have a non-empty name.")
        if criterion.max_marks <= 0:
            raise HTTPException(status_code=400, detail=f"Max marks for '{criterion.name}' must be positive.")

    # ── Check API key ─────────────────────────────────────────────
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not set. Please set it in your environment or .env file."
        )

    # ── Call Gemini ───────────────────────────────────────────────
    try:
        results = await evaluate_with_gemini(request.rubric, request.essay)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

    # ── Build response ────────────────────────────────────────────
    total_score = sum(r.score for r in results)
    total_max = sum(r.max_score for r in results)

    return EvaluationResponse(
        results=results,
        total_score=total_score,
        total_max_score=total_max,
    )


# ── Run with: uvicorn main:app --reload ──────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)