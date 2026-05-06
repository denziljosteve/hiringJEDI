<p align="center">
  <h1 align="center">⚔️ hiringJEDI</h1>
  <p align="center">
    <strong>AI-Powered Resume & Cover Letter Strategist</strong>
  </p>
  <p align="center">
    Tailor your application to any job description in seconds — powered by elite AI models through the Groq API.
  </p>
</p>

---

## Overview

**hiringJEDI** is a full-stack application that acts as your personal resume strategist. It combines the analytical eye of a senior hiring manager, the precision of an ATS optimization engine, and the strategic thinking of a top-tier consultant to maximize your chances of getting shortlisted.

Paste (or upload) a job description and your resume, and hiringJEDI will deliver:
- A **Match Score** with recruiter-style verdict
- A fully **rewritten, ATS-optimized resume** aligned to the JD
- A **tailored cover letter** (450–500 words, strategic and persuasive)
- A detailed **JD skill breakdown** and **recruiter priority analysis**
- A before/after **skills comparison** and a **change log** of all modifications

All wrapped in a premium, futuristic glassmorphic interface designed for a single-viewport experience.

## Features

| Feature | Description |
|---|---|
| 🤖 **Multi-Model Selection** | Choose from GPT-OSS 120B (default), Llama 3.3 70B Versatile, or Llama 4 Scout 17B |
| 📄 **File Uploads** | Drag-and-drop or click to upload `.pdf`, `.docx`, or `.txt` files for automatic text extraction |
| 🎯 **Match Scoring** | AI-assessed compatibility percentage with strategic recruiter verdict |
| ✍️ **Resume Rewrite** | Full resume transformation using `[Action Verb] + [What] + [How] + [Impact]` methodology |
| 💌 **Cover Letter** | Generates or optimizes cover letters with strict formatting and 450–500 word target |
| 📊 **JD Deconstruction** | Ranked skill extraction, ATS keyword analysis, and core recruiter priorities |
| 📋 **Change Log** | Transparent tracking of every modification made to your documents |
| 📥 **Export** | Copy to clipboard or download results as formatted PDFs |
| 🎨 **Glassmorphic UI** | 1080p-optimized, no-scroll interface with deep space gradients and neon accents |

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS v4 with `@tailwindcss/typography` and `@tailwindcss/vite` plugins
- **Markdown Rendering**: react-markdown
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **PDF Export**: html2pdf.js

### Backend
- **Server**: Node.js + Express 5
- **AI Provider**: Groq SDK (multi-model support via API)
- **File Parsing**:
  - `multer` — Multipart form-data upload handling
  - `pdf-parse` — PDF text extraction
  - `mammoth` — DOCX text extraction

## Project Structure

```text
hiringJEDI/
├── backend/
│   ├── index.js              # Express server, API routes, Groq integration, file parsing
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (GROQ_API_KEY, PORT)
│   ├── .env.example           # Template for environment setup
│   └── uploads/               # Temporary directory for uploaded files
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main layout, state management, header & footer
│   │   ├── App.css            # App-level custom styles
│   │   ├── index.css          # Global styles and Tailwind base
│   │   ├── main.jsx           # React DOM entry point
│   │   ├── assets/            # Static assets
│   │   └── components/
│   │       ├── InputForm.jsx      # Model selector, text areas, file uploads, submit button
│   │       └── ResultsDisplay.jsx # Tabbed results viewer with copy/download actions
│   ├── index.html             # HTML entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Frontend dependencies
├── .gitignore
├── LICENSE                    # Apache License 2.0
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- A **[Groq API Key](https://console.groq.com/)**

### 1. Clone the Repository

```bash
git clone https://github.com/denziljosteve/hiringJEDI.git
cd hiringJEDI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (or copy from `.env.example`):

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

Start the backend:

```bash
npm run dev
```

The server will be running at `http://localhost:3001`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open your browser at the URL provided by Vite (typically `http://localhost:5173`).

## Usage

1. **Select an AI model** from the dropdown (GPT-OSS 120B is recommended).
2. **Provide a Job Description** — paste text or upload a PDF/DOCX/TXT file.
3. **Provide your Resume** — paste text or upload a file.
4. *(Optional)* **Provide a Cover Letter** — or let the AI generate one from scratch.
5. Click **Initialize Optimization** and wait for the AI to process.
6. **Browse the results** across 7 tabs:
   - **Match Score** — Compatibility percentage + strategic recruiter verdict
   - **Tailored Resume** — Fully rewritten, ATS-optimized resume
   - **Cover Letter** — Tailored cover letter with professional formatting
   - **JD Breakdown** — Deconstructed skill requirements and priorities
   - **Recruiter Priorities** — What actually gets candidates hired
   - **Skills (Before/After)** — Side-by-side skill section comparison
   - **Change Log** — Detailed record of every change made
7. **Export** — Hover over any result tab to reveal Copy and Download PDF buttons.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Accepts `{ jd, resume, cover, model }` as JSON. Returns structured AI analysis. |
| `POST` | `/extract-text` | Accepts a file upload (`multipart/form-data`). Returns `{ text }` with extracted content. |

## Available Models

| Model ID | Display Name | Notes |
|---|---|---|
| `openai/gpt-oss-120b` | GPT-OSS 120B | Default — recommended for best results |
| `llama-3.3-70b-versatile` | Llama 3.3 70B Versatile | Fast and reliable alternative |
| `meta-llama/llama-4-scout-17b-16e-instruct` | Llama 4 Scout 17B | Lightweight option |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

## Author

**Denzil Josteve Fernandes**

- 🌐 [Portfolio](https://denziljosteve.github.io/)
- 💼 [LinkedIn](https://www.linkedin.com/in/denziljosteve/)
- 🐙 [GitHub](https://github.com/denziljosteve)
