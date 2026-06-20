[Uploading README.md…]()
# 🎓 ClearGrade — AI-Powered Assignment Evaluator

> **Instant, unbiased, rubric-based feedback for every student.**

ClearGrade lets teachers define a custom rubric (e.g. *Clarity 30%, Originality 40%, Structure 30%*), then instantly scores any student submission against it — powered by Google Gemini AI. Each criterion gets a score, a breakdown, and actionable improvement suggestions.

---

## ✨ Features

- **Custom Rubric Builder** — Add/remove criteria with max marks dynamically
- **AI Evaluation** — Scores every criterion using Gemini with strict, fair grading
- **Score Breakdown** — Visual cards for each criterion with color-coded scores
- **Actionable Feedback** — Specific improvement suggestions per criterion
- **One-Click Workflow** — Paste rubric + essay → click Evaluate → get results

---

## 🏗 Architecture

```
┌─────────────────────────┐     POST /evaluate     ┌──────────────────────┐
│   React Frontend (Vite) │ ──────────────────────► │  FastAPI Backend     │
│                         │ ◄────────────────────── │  + Gemini API        │
│   - RubricBuilder       │     JSON response       │  - Prompt builder    │
│   - SubmissionInput     │                         │  - Response parser   │
│   - ScoreCard           │                         │  - Error handling    │
└─────────────────────────┘                         └──────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **Gemini API Key** — free from [aistudio.google.com](https://aistudio.google.com)

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Set your Gemini API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the server
uvicorn main:app --reload
# → Running on http://localhost:8000
```

### 2. Frontend Setup

```bash
# From the project root
npm install
npm run dev
# → Running on http://localhost:5173
```

### 3. Use It

1. Open `http://localhost:5173`
2. Add rubric criteria (e.g. "Clarity" → 30 marks)
3. Paste a student essay
4. Click **Evaluate**
5. View score breakdown + feedback cards

---

## 📁 Project Structure

```
├── backend/               # S's domain
│   ├── main.py            # FastAPI server + /evaluate endpoint
│   ├── models.py          # Pydantic request/response schemas
│   ├── prompt.py          # Gemini prompt builder + parser
│   └── requirements.txt   # Python dependencies
│
├── src/                   
│   ├── components/        # Ab's domain
│   │   ├── RubricBuilder.jsx
│   │   ├── SubmissionInput.jsx
│   │   └── ScoreCard.jsx
│   ├── App.jsx            # N's domain — layout + wiring
│   ├── index.css          # N's domain — styles
│   ├── theme.css          # N's domain — design tokens
│   ├── api.js             # Adv's domain — single API call
│   └── main.jsx           # React entry point
│
├── index.html             # Vite entry
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

---

## ⚙️ API Reference

### `POST /evaluate`

**Request Body:**
```json
{
  "rubric": [
    { "name": "Clarity", "max_marks": 30 },
    { "name": "Originality", "max_marks": 40 },
    { "name": "Structure", "max_marks": 30 }
  ],
  "essay": "Student's essay text goes here..."
}
```

**Response:**
```json
{
  "results": [
    {
      "criterion": "Clarity",
      "score": 25,
      "max_score": 30,
      "feedback": "The writing is generally clear with good paragraph structure..."
    }
  ],
  "total_score": 78,
  "total_max_score": 100
}
```

---

## 👥 Team Pringles

| Role | Member | Ownership |
|------|--------|-----------|
| Backend + Gemini | S | `backend/` |
| Components | Ab | `src/components/` |
| Layout + Styling | N | `App.jsx`, CSS files |
| Integration + Root | Adv | `api.js`, root configs |

---

## 📄 License

Built for hackathon demonstration purposes.
