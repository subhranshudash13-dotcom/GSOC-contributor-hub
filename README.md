# 🚀 GSoC Contributor Hub

> **Your ultimate companion for discovering and tracking Google Summer of Code projects**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## ✨ Features

### 🤖 **AI-Powered Project Matching**
- Multi-step wizard to capture your skills, experience, and interests
- Supports **OpenAI GPT-4** and **Groq Llama 3.3** for intelligent matching
- Get personalized project recommendations with 90%+ accuracy scores
- Detailed reasoning for each match

### 📊 **Comprehensive Project Directory**
- Browse 2000+ GSoC projects from 500+ organizations
- Filter by difficulty (beginner/intermediate/advanced)
- Filter by tech stack (React, Python, Java, Go, Rust, etc.)
- Filter by organization size and location
- Full-text search across titles and descriptions
- Export filtered results to CSV

### 🎯 **User Dashboard** (Coming Soon)
- Track your applications and their status
- View contribution history with GitHub-style heatmap
- Skill progress visualization
- Achievement badge system
- GitHub stats integration

### 🎨 **World-Class UI/UX**
- **3 Beautiful Themes**: Dark, Light, and Sunset Red
- **Glassmorphism** effects throughout
- **Framer Motion** animations for smooth interactions
- **Fully Responsive**: Perfect on mobile, tablet, and desktop
- **PWA Support**: Install as a native app
- **Accessibility**: WCAG 2.2 AA compliant

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15.0 (App Router)
- React 19
- TypeScript 5.6
- Tailwind CSS 3.4
- shadcn/ui components
- Framer Motion for animations
- Zustand for state management
- React Query v5 for data fetching

**Backend:**
- Next.js API Routes
- MongoDB Atlas + Mongoose ODM
- NextAuth.js v5 for authentication
- OpenAI/Groq API integration

**Deployment:**
- Netlify or Vercel
- MongoDB Atlas (cloud database)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- MongoDB Atlas account (free tier available)
- GitHub OAuth App (for authentication)
- OpenAI or Groq API key (for AI matching)

### 1. Installation

```bash
# Navigate to project directory
cd "GSOC contributor hub"

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gsoc-hub

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# GitHub OAuth
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret

# AI Provider - Choose ONE:
# Option 1: OpenAI (Recommended)
OPENAI_API_KEY=sk-your_openai_api_key
AI_PROVIDER=openai

# Option 2: Groq (Free tier available)
# GROQ_API_KEY=gsk_your_groq_api_key
# AI_PROVIDER=groq

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GSOC_YEAR=2026
```

### 3. Setup MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and add to `MONGODB_URI`
4. Whitelist your IP address

### 4. Setup GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env`

### 5. Choose AI Provider

**Option A: OpenAI (Recommended for best results)**
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env` as `OPENAI_API_KEY`
3. Set `AI_PROVIDER=openai`

**Option B: Groq (Free tier, faster inference)**
1. Get API key from [Groq Console](https://console.groq.com)
2. Add to `.env` as `GROQ_API_KEY`
3. Set `AI_PROVIDER=groq`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

## 📦 Build for Production

```bash
# Type check
npm run type-check

# Build
npm run build

# Start production server
npm start
```

## 🌍 Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Add environment variables from `.env`
6. Deploy!

The `netlify.toml` file is already configured.

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env`
5. Deploy!

The `vercel.json` file is already configured.

## 📂 Project Structure

```
gsoc-hub/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── match/        # AI matching endpoint
│   │   └── projects/     # Projects CRUD
│   ├── matcher/          # AI Matcher page
│   ├── projects/         # Projects directory
│   ├── dashboard/        # User dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── features/         # Feature components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/
│   ├── mongodb.ts        # Database connection
│   ├── ai-matcher.ts     # AI matching logic
│   └── utils.ts          # Utility functions
├── models/               # Mongoose schemas
├── types/                # TypeScript types
├── public/               # Static assets
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🎨 Themes

The app supports 3 beautiful themes:
- **Dark** (default) - Easy on the eyes with purple accents
- **Light** - Clean and minimal
- **Sunset** - Vibrant red/orange/pink gradient theme

Toggle themes using the button in the header!

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Summer of Code for inspiring this project
- shadcn for the amazing UI component library
- All open source contributors

## 📧 Contact

Have questions? Reach out or open an issue!

---

**Built with ❤️ for the GSoC community**

## 📸 Screenshots

![Landing Page](screenshots/landing.png)
*Beautiful landing page with countdown timer and search*

![AI Matcher](screenshots/matcher.png)
*Multi-step wizard for AI-powered matching*

![Projects Directory](screenshots/projects.png)
*Comprehensive project directory with filters*

---

## 🎯 Next Steps After Deployment

### Creating a GitHub Repository

1. **Initialize Git** (if not already done):
   ```bash
   cd "GSOC contributor hub"
   git init
   git add .
   git commit -m "Initial commit: GSoC Contributor Hub"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository named `gsoc-contributor-hub`
   - **Do not** initialize with README (we have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/gsoc-contributor-hub.git
   git branch -M main
   git push -u origin main
   ```

4. **Add Topics** (on GitHub):
   - `gsoc`
   - `nextjs`
   - `typescript`
   - `ai`
   - `open-source`
   - `mongodb`

5. **Enable GitHub Pages** (optional):
   - Settings → Pages → Deploy from branch `main`

### Post-Deployment Checklist

- [ ] Test all features on production URL
- [ ] Verify environment variables are set
- [ ] Test AI matching with real API keys
- [ ] Check mobile responsiveness
- [ ] Test all 3 themes
- [ ] Verify PWA installation
- [ ] Test CSV export
- [ ] Share your awesome project! 🎉
