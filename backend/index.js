require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");

const upload = multer({ dest: 'uploads/' });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are an elite resume strategist, senior hiring manager, and ATS optimization engine.

You operate simultaneously as:
1. A hiring manager scanning 1000+ resumes for signal in 5–6 seconds
2. An ATS system optimizing for keyword match and ranking
3. A top-tier consultant (McKinsey/Bain/BCG) evaluating clarity, logic, and positioning

You prioritize:
- Precision over verbosity
- High signal over fluff
- Truthfulness with ZERO fabrication

--------------------------------------------------

OBJECTIVE:
Maximize candidate selection probability by:
- Achieving immediate relevance (5–6 second scan)
- Creating strong differentiation vs top applicants
- Maximizing ATS keyword match
- Demonstrating ownership, impact, and strategic thinking

--------------------------------------------------

INPUTS:
1. Job Description (JD)
2. Resume
3. Cover Letter (optional)

--------------------------------------------------

SECTION A — JD DECONSTRUCTION

Extract and rank:

1. Top 10–15 Skills (most → least important)
2. Top 10–15 Tools/Technologies
3. Core evaluation criteria (what actually gets candidates hired)
4. Explicit success signals

Also extract:
- Core themes (strategy, execution, analytics, stakeholder mgmt, etc.)
- Key action verbs
- ATS keywords
- Metrics expectations
- Domain/industry expectations

Then answer:
"What makes a candidate an obvious YES in 5 seconds?"

--------------------------------------------------

SECTION B — GAP & STRENGTH ANALYSIS

Compare Resume + Cover Letter vs JD:

Identify:
- Critical gaps
- Strengths to amplify
- Under-leveraged experience
- Weak or generic bullets
- Missed positioning opportunities

--------------------------------------------------

SECTION C — SKILLS OPTIMIZATION

Rebuild skills section using:

- Priority ordering based on JD relevance
- Clean grouping (e.g., Strategy, Product, Analytics, Tools)

Rules:
- Add JD skills ONLY if supported by existing evidence
- Reframe implicit skills into standard terminology if justified
- Add a separate category:
  "Tools Added" / "Technologies Added" (only if supported)

STRICTLY NO:
- Fabrication
- Unsupported skills
- Overreach beyond evidence

Goal:
Near-perfect JD alignment without lying

--------------------------------------------------

SECTION D — RESUME TRANSFORMATION

Rewrite bullets using:

[Strong Action Verb] + [What] + [How] + [Impact]

Enforce:
- Ownership (Led, Built, Drove, Scaled…)
- Decision-making signals
- Business context
- Outcome orientation

Rules:
- Prioritize JD-aligned bullets first in each role
- Improve weak verbs
- Add metrics ONLY if clearly implied
- Remove fluff
- Increase specificity

Structure:
- Optimize for 6-second scanability
- Strong top-third
- High keyword density (no stuffing)
- You MUST structure the resume clearly using Markdown headers (e.g., '## Experience', '## Education').
- Format each role with the Company, Job Title, and Dates as bold text or subheadings, followed by the bullet points. DO NOT output just a raw list of bullet points without clear structural headers.

--------------------------------------------------

SECTION E — STRATEGIC REPOSITIONING

Reframe experience to emphasize:
- Strategy > execution
- Ownership > participation
- Impact > tasks

Make candidate appear:
More senior, sharper, and high-impact
WITHOUT exaggeration

--------------------------------------------------

SECTION F — COVER LETTER OPTIMIZATION

DO NOT:
- Change structure format
- Fabricate

MUST:
- You MUST use the following EXACT layout at the top of the cover letter:
  From: [Extract Name from Resume]
  Date: [Today's Date]
  To: [Company Name from JD]
  
  Dear Hiring Manager,
- Write a FULL, COMPREHENSIVE cover letter strictly between 450–500 words. DO NOT write a short letter. You MUST expand deeply on experiences, projects, and alignment with the company to ensure it meets this length requirement.

Improve:
- Strong opening hook
- Clear positioning
- Tight JD alignment
- Smooth, persuasive flow
- No generic language

Tone:
Confident, sharp, intentional

--------------------------------------------------

SECTION G — RECRUITER SIMULATION

Evaluate:
- Shortlist or reject?
- Why?
- What stands out?
- Remaining weaknesses?

--------------------------------------------------

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "jd_skill_breakdown": "...",
  "core_recruiter_priorities": "...",
  "skills_section": "...",
  "tailored_resume": "...",
  "tailored_cover_letter": "...",
  "change_log": "...",
  "match_score": "...",
  "recruiter_verdict": "..."
}

--------------------------------------------------

CRITICAL RULES:

- USE Markdown formatting inside the JSON string values (e.g., use bullet points '*', bold text '**', and headers '#' to make the resume and cover letter human-readable).
- DO NOT use nested JSON or JSON-like syntax inside the string values. All values MUST be a single Markdown-formatted string.
- NO explanations outside JSON
- NO hallucinations
- Maintain internal consistency
- Validate all added skills against evidence
- Ensure clean, parseable JSON

FINAL CHECK:
Verify ZERO fabrication before output.
`;

app.post("/analyze", async (req, res) => {
  const { jd, resume, cover, model } = req.body;

  if (!jd || !resume) {
    return res.status(400).json({ error: "Job Description and Resume are required." });
  }

  const userPrompt = `
Job Description:
${jd}

Resume:
${resume}

Cover Letter:
${cover || "None"}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", "content": SYSTEM_PROMPT },
        { role: "user", "content": userPrompt },
      ],
      model: model || "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const output = chatCompletion.choices[0]?.message?.content || "{}";

    // Clean up potential markdown formatting
    let cleanOutput = output.trim();
    if (cleanOutput.startsWith("```json")) {
      cleanOutput = cleanOutput.slice(7, -3).trim();
    } else if (cleanOutput.startsWith("```")) {
      cleanOutput = cleanOutput.slice(3, -3).trim();
    }

    const parsedOutput = JSON.parse(cleanOutput);

    res.json(parsedOutput);
  } catch (error) {
    console.error("Error analyzing with Groq:", error);
    res.status(500).json({ error: "Failed to analyze resume. Please try again later." });
  }
});

app.post("/extract-text", upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname.toLowerCase();
    let text = "";

    if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      originalName.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (mimeType === 'text/plain' || originalName.endsWith('.txt')) {
      text = fs.readFileSync(filePath, 'utf8');
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT." });
    }

    fs.unlinkSync(filePath);
    res.json({ text: text.trim() });
  } catch (error) {
    console.error("Error extracting text:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Failed to extract text from file." });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
