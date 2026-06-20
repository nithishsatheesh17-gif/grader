/**
 * RubricBuilder Component (Ab's file)
 *
 * Props:
 *   - rubric: Array<{ name: string, max_marks: number }> — current rubric state
 *   - onChange: (newRubric) => void — called when rubric changes
 *
 * Features to build:
 *   - Input fields for criterion name + max marks
 *   - Add/remove criteria dynamically
 *   - Pass rubric array up via onChange prop
 */

import React, { useState } from "react";

export default function RubricBuilder({ rubric, onChange }) {
  const [criterionName, setCriterionName] = useState("");
  const [maxMarks, setMaxMarks] = useState("");

  const handleAdd = () => {
    const trimmedName = criterionName.trim();
    const marks = Number(maxMarks);

    if (!trimmedName || !maxMarks || marks <= 0 || isNaN(marks)) return;

    const newRubric = [...rubric, { name: trimmedName, max_marks: marks }];
    onChange(newRubric);
    setCriterionName("");
    setMaxMarks("");
  };

  const handleRemove = (indexToRemove) => {
    const newRubric = rubric.filter((_, index) => index !== indexToRemove);
    onChange(newRubric);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="rubric-builder">
      <h2>📝 Rubric Builder</h2>

      <div className="rubric-inputs">
        <input
          id="criterion-name-input"
          type="text"
          placeholder="Criterion name (e.g. Grammar)"
          value={criterionName}
          onChange={(e) => setCriterionName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          id="criterion-marks-input"
          type="number"
          placeholder="Max marks"
          min="1"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          id="add-criterion-btn"
          type="button"
          onClick={handleAdd}
          disabled={!criterionName.trim() || !maxMarks || Number(maxMarks) <= 0}
        >
          + Add Criterion
        </button>
      </div>

      {rubric.length === 0 && (
        <p className="rubric-empty-message">
          No criteria added yet. Add at least one criterion to build your rubric.
        </p>
      )}

      <ul className="rubric-list">
        {rubric.map((criterion, index) => (
          <li key={index} className="rubric-item">
            <span className="rubric-item-name">{criterion.name}</span>
            <span className="rubric-item-marks">{criterion.max_marks} marks</span>
            <button
              className="rubric-remove-btn"
              type="button"
              onClick={() => handleRemove(index)}
              aria-label={`Remove ${criterion.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
