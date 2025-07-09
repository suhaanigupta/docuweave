
# 🧾 DocuWeave – AI-Powered Contract Analyzer

DocuWeave is a smart contract analysis tool designed to help users — especially non-lawyers — understand legal documents effortlessly. It uses LLaMA-3 via Gemini API to extract, explain, and evaluate clauses from uploaded PDFs. Built with React and Express, it features Firebase-based user authentication and is fully deployed on Netlify and Render.
- 🔗 **The deployed website**: [Link](https://docuweave.netlify.app)
---

## 🚀 Features

- 📄 Upload legal contracts in PDF format (up to 10MB)
- 🧠 AI-powered clause-by-clause analysis using Gemini (LLaMA-3)
- ⚠️ Detects legal risks and suggests mitigation strategies
- 🔒 Secure Firebase Authentication for login/register
- 🌗 Elegant dark/light theme toggle
- 📱 Responsive UI built with React
- ☁️ Fully deployed (Frontend on Netlify, Backend on Render)

---

## 📦 Tech Stack

| Layer       | Tech Stack                               |
|-------------|-------------------------------------------|
| Frontend    | React, React Router, Firebase Auth, Axios |
| Backend     | Express.js, Node.js, pdfjs-dist, LangChain|
| AI Engine   | Gemini API (LLaMA-3) via LangChain        |
| Auth        | Firebase Authentication                   |
| Deployment  | Netlify (Frontend) + Render (Backend)     |

---

## 🛠 Setup Instructions

### 🔑 1. Environment Setup

Create two `.env` files in the respective folders (`/client/.env` and `/server/.env`) and populate with your Firebase, Gemini, and backend config:

**/client/.env**
```
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_gemini_key
REACT_APP_BACKEND_URL=http://localhost:5050
```

**/server/.env**
```
GEMINI_API_KEY=your_gemini_key
```

---

### ▶️ 2. Run Locally

**Frontend**

```bash
cd client
npm install
npm start
```

**Backend**

```bash
cd server
npm install
node index.mjs
```

---

## 📂 Project Structure

```
docuweave/
│
├── client/                # React Frontend
│   ├── src/
│   ├── App.js
│   └── ...
│
├── server/                # Express Backend
│   ├── index.mjs
│   ├── routes/
│   └── ...
│
└── README.md
```

---

## 📌 Deployment

- 🔗 **Frontend**: [Netlify Link](https://docuweave.netlify.app)
- 🔗 **Backend**: [Render Link](https://docuweave-backend.onrender.com)

---
