🎓 ClearGrade — AI-Powered Assignment EvaluatorInstant, unbiased, rubric-based feedback for every student.ClearGrade lets teachers define a custom rubric (e.g., Clarity 30%, Originality 40%, Structure 30%), then instantly scores any student submission against it — powered by Google Gemini AI. Each criterion gets a score, a breakdown, and actionable improvement suggestions.✨ FeaturesCustom Rubric Builder — Add/remove criteria with max marks dynamically.AI Evaluation — Scores every criterion using Gemini with strict, fair grading.Score Breakdown — Visual cards for each criterion with color-coded scores.Actionable Feedback — Specific improvement suggestions per criterion.One-Click Workflow — Paste rubric + essay $\rightarrow$ click Evaluate $\rightarrow$ get results.🏗 ArchitecturePlaintext┌─────────────────────────┐     POST /evaluate     ┌──────────────────────┐
│   React Frontend (Vite) │ ──────────────────────► │  FastAPI Backend     │
│                         │ ◄────────────────────── │  + Gemini API        │
│   - RubricBuilder       │     JSON response       │  - Prompt builder    │
│   - SubmissionInput     │                         │  - Response parser   │
│   - ScoreCard           │                         │  - Error handling    │
└─────────────────────────┘                         └──────────────────────┘
🚀 Quick StartPrerequisitesPython 3.10+ with pipNode.js 18+ with npmGemini API Key — free from aistudio.google.com1. Backend SetupBashcd backend
pip install -r requirements.txt

# Set your Gemini API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the server
uvicorn main:app --reload
# → Running on http://localhost:8000
2. Frontend SetupBash# From the project root
npm install
npm run dev
# → Running on http://localhost:5173
3. Use ItOpen http://localhost:5173Add rubric criteria (e.g., "Clarity" $\rightarrow$ 30 marks)Paste a student essayClick EvaluateView score breakdown + feedback cards📁 Project StructurePlaintext├── backend/               # FastAPI backend
│   ├── main.py            # FastAPI server + /evaluate endpoint
│   ├── models.py          # Pydantic request/response schemas
│   ├── prompt.py          # Gemini prompt builder + parser
│   └── requirements.txt   # Python dependencies
│
├── src/                   # React frontend
│   ├── components/        # UI Components
│   │   ├── RubricBuilder.jsx
│   │   ├── SubmissionInput.jsx
│   │   └── ScoreCard.jsx
│   ├── App.jsx            # Layout, state management & wiring
│   ├── index.css          # Global styles
│   ├── theme.css          # Design tokens & variables
│   ├── api.js             # API client network calls
│   └── main.jsx           # React entry point
│
├── index.html             # Vite entry
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
⚙️ API ReferencePOST /evaluateRequest BodyJSON{
  "rubric": [
    { "name": "Clarity", "max_marks": 30 },
    { "name": "Originality", "max_marks": 40 },
    { "name": "Structure", "max_marks": 30 }
  ],
  "essay": "Student's essay text goes here..."
}
ResponseJSON{
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
📄 LicenseBuilt for hackathon demonstration purposes.
