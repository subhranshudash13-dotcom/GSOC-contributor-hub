# Analytics Guide - GSoC Contributor Hub

This guide explains how to monitor your website's traffic, visitor behavior, and performance using the integrated analytics tools.

## 1. Vercel Analytics (Recommended)
Since your project is hosted on Vercel, you have access to a powerful, privacy-friendly analytics dashboard.

### How to Access:
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project: `GSOC contributor hub`.
3. Click on the **Analytics** tab in the top navigation bar.

### What you can see:
- **Visitors**: Number of unique visitors and total pageviews.
- **Top Pages**: Which projects or search terms are most popular.
- **Referrers**: Where your traffic is coming from (GitHub, Twitter, LinkedIn, etc.).
- **Demographics**: Countries and devices used by your visitors.

## 2. Vercel Speed Insights
This tool monitors the real-world performance of your site, which is a critical factor for SEO ranking.

### How to Access:
- In your Vercel project dashboard, click on the **Speed Insights** tab.
- You can see your **Core Web Vitals** (LCP, FID, CLS), which Google uses to determine your search rank.

## 3. Google Analytics (GA4)
If you have configured your `NEXT_PUBLIC_GA_ID` in Vercel, you can use the official Google Analytics platform.

### Step-by-Step Setup:
1.  **Create a Property**:
    - Go to [analytics.google.com](https://analytics.google.com).
    - Click **Admin** (gear icon) -> **Create** -> **Property**.
    - Name it `GSoC Contributor Hub` and follow the prompts.
2.  **Create a Data Stream**:
    - Select **Web** as the platform.
    - Enter your website URL (e.g., `gsoc-contributor-hub.vercel.app`) and Stream name.
    - Click **Create stream**.
3.  **Get Measurement ID**:
    - In the "Web stream details" window, look for the **MEASUREMENT ID** in the top right (starts with `G-`).
4.  **Configure Environment Variable**:
    - Add `NEXT_PUBLIC_GA_ID` with your Measurement ID to your Vercel/Netlify Environment Variables.

### Key Reports:
- **Realtime**: See how many people are on the site *right now* (great for testing).
- **Acquisition**: A detailed breakdown of how users found your site (Direct, Social, Search).
- **Engagement**: How long users are staying on each project page and what buttons they click.

---

> [!IMPORTANT]
> **Privacy Note**: Ensure you have a simple privacy policy on your site if you are collecting data from users in regions like the EU (GDPR compliance).

> [!TIP]
> To test if it's working: Open your site in an Incognito tab and check the **Realtime** report in Google Analytics. You should see yourself as "1 active user".
