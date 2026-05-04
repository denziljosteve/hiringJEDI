# hiringJEDI (formerly Application Tailor)

**hiringJEDI** is a cutting-edge, full-stack application designed to help job seekers instantly tailor their resumes and cover letters to specific job descriptions. Powered by Groq's high-speed LLM APIs (Llama 3 70b) and wrapped in a premium, futuristic glassmorphic UI, hiringJEDI provides actionable insights, match scores, and rewritten documents in seconds.

## Features

* **Futuristic UI**: A responsive, 1080p-optimized single-frame interface featuring deep space gradients, glassmorphism, neon accents, and smooth micro-animations.
* **File Uploads**: Automatically extract text from your Job Description, Resume, and Cover Letter. Supports `.pdf`, `.docx`, and `.txt` files.
* **Instant Analysis**: Get a comprehensive breakdown of your fit for a role, including a **Match Score** and a **Recruiter Verdict**.
* **AI Optimization**: Generates a fully rewritten resume and a tailored cover letter designed to highlight the exact skills the job description asks for.
* **Export Options**: Copy results directly to your clipboard or download them as cleanly formatted PDFs.

## Tech Stack

### Frontend
* **Framework**: React 19 + Vite
* **Styling**: TailwindCSS v4 with custom CSS for futuristic scrollbars and base themes.
* **Icons**: Lucide React
* **PDF Export**: html2pdf.js

### Backend
* **Server**: Node.js + Express
* **AI Provider**: Groq SDK (`llama3-70b-8192`)
* **File Parsing**: 
  * `multer` (Handling form-data uploads)
  * `pdf-parse` (Extracting text from PDFs)
  * `mammoth` (Extracting text from DOCX files)

## Project Structure

```text
hiringJEDI/
├── backend/
│   ├── index.js          # Express server, file parsing, and Groq API integration
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables (needs GROQ_API_KEY)
└── frontend/
    ├── src/
    │   ├── App.jsx       # Main layout and state management
    │   ├── index.css     # Global styles and Tailwind configuration
    │   └── components/
    │       ├── InputForm.jsx      # Form for pasting text or uploading files
    │       └── ResultsDisplay.jsx # Tabbed interface for viewing AI analysis
    ├── index.html        # Main HTML entry point
    ├── vite.config.js    # Vite configuration
    └── package.json      # Frontend dependencies
```

## Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* A [Groq API Key](https://console.groq.com/)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3001
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## Usage

1. Paste a **Job Description** or upload a file.
2. Paste your **Resume** or upload a file.
3. (Optional) Provide a **Cover Letter** or let the AI write one from scratch.
4. Click **Initialize Optimization**.
5. Wait for the data stream to complete.
6. Browse through the tabs (Match Score, Resume, Cover Letter, JD Breakdown, Skills) to review your tailored application.
7. Use the Copy or Download buttons to save your optimized documents.
