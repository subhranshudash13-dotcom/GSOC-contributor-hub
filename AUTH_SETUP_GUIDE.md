# Authentication Setup & Access Guide

Follow these steps to activate the login system and access your new management tools.

## 🔑 1. Get Your API Secrets

### A. GitHub OAuth (Recommended First)
1.  Go to [GitHub Developer Settings](https://github.com/settings/developers).
2.  Click **New OAuth App**.
3.  **Application Name**: `GSoC Hub`
4.  **Homepage URL**: `http://localhost:3000` (for local) or your Vercel URL.
5.  **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
6.  Click **Register**.
7.  Copy the **Client ID** and generate a **Client Secret**.

### B. Google OAuth (Detailed Steps)

#### 1. Create a Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the **Project Dropdown** at the top (next to "Google Cloud") and select **New Project**.
3.  **Project Name**: `GSoC Contributor Hub`
4.  Click **Create** and wait for it to finish.

#### 2. Configure OAuth Consent Screen
1.  In the sidebar, go to **APIs & Services > OAuth consent screen**.
2.  Select **External** and click **Create**.
3.  **App Information**: Fill in "GSoC Hub" and your email.
4.  Click **Save and Continue** through the next screens (Scopes, Test Users) until you reach the **Summary**.
5.  On the Dashboard, click **Publish App** to make it accessible to all users.

#### 3. Create Credentials
1.  Go to **APIs & Services > Credentials**.
2.  Click **+ Create Credentials** > **OAuth client ID**.
3.  **Application Type**: Web application.
4.  **Name**: `GSoC Hub Web Client`
5.  **Authorized Javascript Origins**: `http://localhost:3000` (and your production URL later).
6.  **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7.  Click **Create**.
8.  Copy the **Client ID** and **Client Secret**.

### C. Generate Auth Secret
Run this command in your terminal to generate a secure random string:
```bash
npx auth secret
```

---

## 📝 2. Add to Environment Variables
Add these to your `.env` (local) or Vercel Environment Variables:

```env
AUTH_SECRET=your_generated_secret
AUTH_GITHUB_ID=your_github_id
AUTH_GITHUB_SECRET=your_github_secret
AUTH_GOOGLE_ID=your_google_id
AUTH_GOOGLE_SECRET=your_google_secret
```

---

## 🚀 3. How to Access Features

| Feature | URL | Who can see it? |
| :--- | :--- | :--- |
| **Login Page** | `/auth/signin` | Everyone |
| **User Dashboard** | `/dashboard` | Logged-in Users |
| **Owner Console** | `/admin` | You (Admin only) |

> [!TIP]
> **To access the Admin page**:
> Log in with the email `subhranshudash13@gmail.com`. If you want to use a different email, open [admin/page.tsx](file:///c:/Users/Hp/Desktop/SSD_javaprojects/newer/GSOC%20contributor%20hub/app/admin/page.tsx) and change line 11 to your preferred email address.
