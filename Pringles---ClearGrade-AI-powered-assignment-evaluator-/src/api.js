/**
 * ClearGrade API Client
 * 
 * Single integration point between the React frontend and the FastAPI backend.
 * Only Adv edits this file.
 */

const API_BASE_URL = "http://localhost:8000";

/**
 * Evaluate a student submission against a rubric.
 *
 * @param {Array<{name: string, max_marks: number}>} rubric - List of rubric criteria
 * @param {string} essay - The student's submission text
 * @returns {Promise<{results: Array<{criterion: string, score: number, max_score: number, feedback: string}>, total_score: number, total_max_score: number}>}
 * @throws {Error} If the API call fails or returns an error
 *
 * Usage in App.jsx:
 *   import { evaluateSubmission } from "./api";
 *   const data = await evaluateSubmission(rubric, essay);
 */
export async function evaluateSubmission(rubric, essay) {
  const response = await fetch(`${API_BASE_URL}/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rubric, essay }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Server error (${response.status})`;
    throw new Error(message);
  }

  return response.json();
}
