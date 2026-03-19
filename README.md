# 🎬 ReelGen - Viral Reel Script Generator

ReelGen is an AI-powered viral reel script generator built with **Next.js 15** and **Python (FastAPI)**, optimized for seamless deployment on **Vercel**. It uses **OpenRouter** with a sophisticated 10-model fallback system to ensure reliable, high-quality script generation every time.

![ReelGen Testing Results](C:/Users/Geeta/.gemini/antigravity/brain/4297b8f1-f618-43b7-93bf-bc711193fe04/.system_generated/click_feedback/click_feedback_1773931917818.png)

## ✨ Features

- **Premium Cinematic UI**: Modern dark mode with glassmorphism, glowing effects, and smooth animations.
- **AI-Powered**: Generates scripts including Direction, Hook, Body, and CTA.
- **Reliable Fallbacks**: Automatic 10-model fallback system using OpenRouter (Gemini, Llama 3, DeepSeek, etc.).
- **Vercel Optimized**: Configured for Vercel Serverless Functions (Python + Next.js).
- **One-Click Copy**: Easily copy your generated scripts to the clipboard.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router, TypeScript)
- **Styling**: Vanilla CSS (Custom Cinematic Design System)
- **Backend**: Python (FastAPI, Vercel Serverless)
- **API**: OpenRouter (Unified AI Interface)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.9+

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Setup & Installation

**Initialize Python Backend:**
```bash
pip install -r requirements.txt
```

**Initialize Frontend:**
```bash
npm install
```

### 4. Local Development

**Run the Python API (Port 8000):**
```bash
python -m uvicorn api.index:app --port 8000 --reload
```

**Run the Next.js Dev Server (Port 3000):**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## ☁️ Deployment

This project is pre-configured for **Vercel**.
1. Push your code to a GitHub repository.
2. Connect the repository to a new project on Vercel.
3. Add your `OPENROUTER_API_KEY` to the Vercel Project Settings > Environment Variables.
4. Deploy!

## 📄 License
MIT
