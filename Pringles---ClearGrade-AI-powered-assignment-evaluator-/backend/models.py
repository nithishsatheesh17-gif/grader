"""
Pydantic models for the ClearGrade API.
Defines request and response schemas for the /evaluate endpoint.
"""

from pydantic import BaseModel, Field
from typing import List


class Criterion(BaseModel):
    """A single rubric criterion with a name and maximum marks."""
    name: str = Field(..., min_length=1, description="Name of the criterion, e.g. 'Clarity'")
    max_marks: float = Field(..., gt=0, description="Maximum marks for this criterion")


class EvaluationRequest(BaseModel):
    """Request body for the /evaluate endpoint."""
    rubric: List[Criterion] = Field(..., min_length=1, description="List of rubric criteria")
    essay: str = Field(..., min_length=1, description="Student submission text")


class CriterionResult(BaseModel):
    """Score result for a single criterion."""
    criterion: str
    score: float
    max_score: float
    feedback: str


class EvaluationResponse(BaseModel):
    """Full evaluation response — a list of scored criteria."""
    results: List[CriterionResult]
    total_score: float
    total_max_score: float
