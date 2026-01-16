# Vercel Deployment Guide - GSoC Contributor Hub

Follow these steps to deploy your project to Vercel and ensure all features (AI, Database, Analytics) work perfectly.

## 1. Environment Variables
When importing your project to Vercel, you will see an **Environment Variables** section. Add the following keys:

### Core Requirements
| Key | Value / Source |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB connection string (from MongoDB Atlas). |
| `AI_PROVIDER` | `groq` or `openai` (depending on which you use). |
| `GROQ_API_KEY` | Your Groq API key (starts with `gsk_`). |
| `OPENAI_API_KEY` | Your OpenAI API key (if using OpenAI). |
| `NEXT_PUBLIC_GSOC_YEAR` | `2026` |

### Analytics & SEO
| Key | Value / Source |
| :--- | :--- |
| `NEXT_PUBLIC_GA_ID` | Your Google Analytics Measurement ID (starts with `G-`). |
| `NEXT_PUBLIC_APP_URL` | Your production URL (e.g., `https://your-project.vercel.app`). |

### Authentication (If active)
| Key | Value / Source |
| :--- | :--- |
| `NEXTAUTH_SECRET` | Any random long string (used to encrypt session cookies). |
| `NEXTAUTH_URL` | Your production URL. |
| `GITHUB_ID` | From GitHub Developer Settings (OAuth App). |
| `GITHUB_SECRET` | From GitHub Developer Settings (OAuth App). |

---

## 2. Deployment Steps
1. Push your latest code to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New"** -> **"Project"**.
3. Import your `GSOC-contributor-hub` repo.
4. Expand the **Environment Variables** section and paste the keys above.
5. Click **Deploy**.

## 3. Post-Deployment Activation
Once the site is live:
1. Go to your project **Settings** -> **Analytics** and click **Enable**.
2. Go to **Settings** -> **Speed Insights** and click **Enable**.

---

> [!TIP]
> You don't need to install anything else. The `@vercel/analytics` and `@vercel/speed-insights` I added to the code will automatically start sending data to your Vercel dashboard as soon as you "Enable" them in the settings!
