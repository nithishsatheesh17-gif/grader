/**
 * ScoreCard Component (Ab's file)
 *
 * Props:
 *   - results: Array<{ criterion: string, score: number, max_score: number, feedback: string }>
 *   - totalScore: number
 *   - totalMaxScore: number
 *
 * Features to build:
 *   - Render one card per criterion: name, score/max, feedback
 *   - Show overall total at the bottom
 *   - Use green for high scores, yellow for medium, red for low
 *     (N will provide CSS classes: .score-high, .score-medium, .score-low)
 */

import React from "react";

/**
 * Returns a CSS class based on the score percentage.
 *   >= 75% → "score-high"   (green)
 *   >= 50% → "score-medium" (yellow)
 *   <  50% → "score-low"    (red)
 */
function getScoreClass(score, maxScore) {
  if (maxScore === 0) return "score-medium";
  const pct = (score / maxScore) * 100;
  if (pct >= 75) return "score-high";
  if (pct >= 50) return "score-medium";
  return "score-low";
}

export default function ScoreCard({ results, totalScore, totalMaxScore }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="score-card">
      <h2>🏆 Results</h2>

      <ul className="score-list">
        {results.map((item, index) => (
          <li key={index} className={`score-item ${getScoreClass(item.score, item.max_score)}`}>
            <div className="score-item-header">
              <span className="score-criterion">{item.criterion}</span>
              <span className="score-value">
                {item.score} / {item.max_score}
              </span>
            </div>
            <p className="score-feedback">{item.feedback}</p>
          </li>
        ))}
      </ul>

      <div className={`score-total ${getScoreClass(totalScore, totalMaxScore)}`}>
        <span className="score-total-label">Total Score</span>
        <span className="score-total-value">
          {totalScore} / {totalMaxScore}
        </span>
      </div>
    </div>
  );
}
