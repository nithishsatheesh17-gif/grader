/**
 * SubmissionInput Component (Ab's file)
 *
 * Props:
 *   - essay: string — current essay text
 *   - onEssayChange: (newEssay) => void — called when essay text changes
 *   - onSubmit: () => void — called when "Evaluate" button is clicked
 *   - loading: boolean — true while evaluation is in progress
 *
 * Features to build:
 *   - Large textarea for the essay
 *   - "Evaluate" button
 *   - Call onSubmit prop when clicked — do NOT call the API directly
 *   - Disable button while loading
 */

import React from "react";

export default function SubmissionInput({ essay, onEssayChange, onSubmit, loading }) {
  const handleChange = (e) => {
    onEssayChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && essay.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="submission-input">
      <h2>📄 Student Submission</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          id="essay-textarea"
          placeholder="Paste or type the student's essay here..."
          value={essay}
          onChange={handleChange}
          rows={12}
          disabled={loading}
        />

        <button
          id="evaluate-btn"
          type="submit"
          disabled={loading || !essay.trim()}
        >
          {loading ? "⏳ Evaluating..." : "🚀 Evaluate"}
        </button>
      </form>
    </div>
  );
}
