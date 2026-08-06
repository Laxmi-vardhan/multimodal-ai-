# OmniFusion AI — Multimodal AI Platform

OmniFusion AI is a production-ready, full-stack Multimodal AI workspace that enables users to upload **PDFs, text files, high-resolution images, audio recordings, and videos**, then interact with all content simultaneously using **Google Gemini 2.5 Multimodal SDK**.

---

## 🚀 Key Features

- 🔐 **Authentication & RLS**: JWT authentication with bcrypt password hashing and Supabase Row Level Security (RLS).
- 📁 **Multimodal File Dropzone**: Drag-and-drop support for PDF, PNG/JPEG, MP3/WAV/M4A, MP4/WEBM, and TXT files up to 50MB.
- 🏷️ **Domain Categorization**: Educational, Healthcare, Legal, Research, Business, and Personal tags.
- 💬 **Cross-File Conversational AI**: Multimodal chat assistant that synthesizes answers across single or multiple files with source citations.
- ⚡ **Structured AI Insights**: Automated extraction returning Executive Summary, Key Insights, Domain Keywords, and Action Items.
- 🃏 **Interactive 3D Study Flashcards**: Flip cards with animated 3D rotation and mastery progress tracking.
- 🎯 **Interactive Knowledge Quizzes**: AI-generated multiple-choice questions with instant scoring, feedback explanations, and victory confetti.
- 📄 **Downloadable PDF Reports**: One-click server-side PDF synthesis export.
- 🔍 **Cross-File Semantic Search**: Instant search across filenames, OCR extractions, and AI summaries.
- 📊 **Visual Analytics Dashboard**: Recharts storage consumption breakdown and category distribution graphs.
- 📜 **Audit History & Timeline**: Chronological log of all actions, uploads, and chat sessions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts, Canvas-Confetti, Axios, React Router v7
- **Backend**: Node.js, Express.js, `@google/genai` Official SDK, Supabase PostgreSQL / Local Store Engine, Zod Validation, Multer, PDFKit, JWT, Bcryptjs, Morgan, Express Rate Limit

---

## 📂 Project Directory Structure

```text
c:/new multi modal ai/
├── client/                     # Vite + React 18 Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Hero, UploadZone, ChatBox, Viewer, AIResponse, Cards, Charts, Flashcards, Quiz
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Upload, Chat, Search, History, Reports, Profile, Settings
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── services/           # Axios API modules (auth, file, chat, report, search, profile)
│   │   ├── App.jsx             # React Router Config
│   │   └── index.css           # Glassmorphism theme & Tailwind directives
│   └── vite.config.js
└── server/                     # Express.js REST API
    ├── src/
    │   ├── db/                 # schema.sql & Supabase/Local JSON Fallback Store
    │   ├── controllers/        # auth, upload, chat, search, report, history, profile
    │   ├── routes/             # Express API endpoints
    │   ├── services/           # geminiService (@google/genai), pdfService
    │   ├── middleware/         # authMiddleware, uploadMiddleware, validateMiddleware, errorMiddleware
    │   ├── utils/              # zodSchemas
    │   └── index.js            # Express Entry point
    └── uploads/                # Local file storage vault
```

---

## ⚡ Quick Start & Local Execution

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
# Client starts on http://localhost:3000
```

### 3. Environment Variables (`server/.env`)
```env
PORT=5000
JWT_SECRET=omnifusion_jwt_secret_key_production_2026
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## 🚀 Quick Start Demo Flow

1. **Register/Sign In** → Instant JWT session startup.
2. **Upload Asset Vault** → Drag & Drop PDFs, high-res images, audio clips, or videos.
3. **Multimodal AI Synthesis** → Watch Gemini automatically produce structured summaries, 3D flashcards, and quizzes.
4. **Cross-File Chat** → Ask complex questions referencing multiple attached documents at once.
5. **Export PDF Report** → Download branded PDF summary.
