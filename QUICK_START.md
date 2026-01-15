# 🚀 QUICK START GUIDE

## PowerShell Execution Policy Fix

Your system has PowerShell script execution disabled. To run npm commands, you need to enable it:

### Option 1: Run in PowerShell as Administrator (Recommended)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option 2: Use Command Prompt Instead
Open **Command Prompt** (cmd.exe) instead of PowerShell and run all commands there.

### Option 3: Bypass for Current Session (Temporary)
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

## Installation Steps

1. **Fix PowerShell** (choose one option above)

2. **Install Dependencies**
   ```bash
   cd "GSOC contributor hub"
   npm install
   ```

3. **Setup Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your API keys:
     - MongoDB Atlas connection string
     - GitHub OAuth credentials  
     - OpenAI OR Groq API key

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to http://localhost:3000
   - Enjoy your GSoC Contributor Hub! 🎉

## Environment Variables Needed

Before running, you must set up these in `.env`:

### Required:
- `MONGODB_URI` - Get from MongoDB Atlas (free tier)
- `NEXTAUTH_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `GITHUB_ID` - Create OAuth app at github.com/settings/developers
- `GITHUB_SECRET` - From same OAuth app

### Choose ONE AI Provider:
- **OpenAI**: `OPENAI_API_KEY` + `AI_PROVIDER=openai`
- **Groq**: `GROQ_API_KEY` + `AI_PROVIDER=groq`

## Quick Links

- **MongoDB Atlas**: https://www.mongodb.com/atlas (Create free cluster)
- **GitHub OAuth**: https://github.com/settings/developers (Create new app)
- **OpenAI Keys**: https://platform.openai.com/api-keys
- **Groq Keys**: https://console.groq.com

## Troubleshooting

### Issue: Module not found errors
**Solution**: Run `npm install` again

### Issue: MongoDB connection failed
**Solution**: Check your MONGODB_URI in `.env` and whitelist your IP in MongoDB Atlas

### Issue: TypeScript errors
**Solution**: Run `npm run type-check` to see specific errors

### Issue: Build failures
**Solution**: Delete `.next` folder and `node_modules`, then run `npm install` again

## Next Steps After Setup

1. Create sample projects in MongoDB
2. Test AI matcher with your skills
3. Customize themes and colors
4. Deploy to Netlify or Vercel
5. Create GitHub repo (see README.md)

Need help? Check the full README.md for detailed instructions! 📖
