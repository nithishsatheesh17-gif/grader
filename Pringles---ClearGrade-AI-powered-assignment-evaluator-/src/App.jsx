/**
 * ClearGrade — App Shell (App.jsx)
 *
 * Wires together: RubricBuilder, SubmissionInput, ScoreCard
 * Manages state for rubric, essay, results, loading, and errors.
 */

import React, { useState, useEffect, useCallback } from "react";
import { evaluateSubmission } from "./api";
import RubricBuilder from "./components/RubricBuilder";
import SubmissionInput from "./components/SubmissionInput";
import ScoreCard from "./components/ScoreCard";

export default function App() {
  // ── State ─────────────────────────────────────────────
  const [rubric, setRubric] = useState([]);
  const [essay, setEssay] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-dismiss error toast after 6 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  // ── Handlers ──────────────────────────────────────────
  const handleRubricChange = useCallback((newRubric) => {
    setRubric(newRubric);
  }, []);

  const handleEssayChange = useCallback((newEssay) => {
    setEssay(newEssay);
  }, []);

  const handleEvaluate = useCallback(async () => {
    // Filter out any empty/placeholder criteria
    const validRubric = rubric.filter(
      (c) => c.name && c.name.trim() && c.max_marks && Number(c.max_marks) > 0
    );

    if (validRubric.length === 0) {
      setError("Please add at least one rubric criterion before evaluating.");
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const data = await evaluateSubmission(validRubric, essay);
      setResults(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [rubric, essay]);

  // ── Render ────────────────────────────────────────────
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-logo">ClearGrade</h1>
        <p className="app-tagline">
          Instant, unbiased, rubric-based AI feedback for every student.
        </p>
      </header>

      {/* Rubric Builder */}
      <RubricBuilder rubric={rubric} onChange={handleRubricChange} />

      {/* Submission Input + Evaluate */}
      <SubmissionInput
        essay={essay}
        onEssayChange={handleEssayChange}
        onSubmit={handleEvaluate}
        loading={loading}
      />

      {/* Loading indicator */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <span className="loading-text">Analyzing submission…</span>
        </div>
      )}

      {/* Results */}
      {results && (
        <ScoreCard
          results={results.results}
          totalScore={results.total_score}
          totalMaxScore={results.total_max_score}
        />
      )}

      {/* Error Toast */}
      {error && (
        <div className="toast-notification" role="alert">
          <span className="toast-icon">⚠️</span>
          <div className="toast-body">
            <div className="toast-title">Evaluation Failed</div>
            <div className="toast-message">{error}</div>
          </div>
          <button
            className="toast-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}


    </div>
  );
}
