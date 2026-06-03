# Vercel Deployment Guide for GSoC Contributor Hub

To make your website public and allow others to sign in, follow these steps to deploy to Vercel and configure your OAuth providers.

## 1. Environment Variables in Vercel
Go to your **Vercel Project Settings > Environment Variables** and add the following keys from your `.env` file:

| Secret Key | Source / Value |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB connection string |
| `AUTH_SECRET` | Run `npx auth secret` in your terminal to get a new one |
| `AUTH_URL` | Your production URL (e.g., `https://gsoccontributorhub.vercel.app`) |
| `AUTH_GITHUB_ID` | From GitHub Developer Settings |
| `AUTH_GOOGLE_SECRET` | From Google Cloud Console |
| `NEXT_PUBLIC_APP_URL` | `https://gsoccontributorhub.vercel.app` |
| `AUTH_TRUST_HOST` | Set this to `true` |

> [!IMPORTANT]
> Change `NEXT_PUBLIC_APP_URL` from `http://localhost:3000` to your actual Vercel URL once the deployment is finished.

## 2. Update OAuth Redirect URIs
You must tell GitHub and Google that your production URL is allowed to handle logins.

### **GitHub Configuration**
1.  Go to [GitHub Developer Settings](https://github.com/settings/developers).
2.  Edit your OAuth App.
3.  Add your production callback URL: `https://your-app-name.vercel.app/api/auth/callback/github`

### **Google Configuration**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2.  Edit your **OAuth 2.0 Client ID**.
3.  Under **Authorized redirect URIs**, add: `https://your-app-name.vercel.app/api/auth/callback/google`

## 3. Deploy to Vercel
1.  Push your code to a GitHub repository.
2.  Import the repository into Vercel.
3.  Vercel will automatically detect Next.js and build your app.

## 4. Final Verification
Once deployed, visit your Vercel URL and try:
1.  Clicking **Sign In**.
2.  Logging in with a different account.
3.  Saving a project to verify the database connection.
