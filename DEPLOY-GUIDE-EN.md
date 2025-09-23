# 🚀 Quick Deploy Guide - English Version

Quick deployment guide for Yuki Yaki Corner to Netlify for international users.

## Prerequisites
- GitHub account
- Netlify account (free)
- Code repository ready

## 1. Netlify Setup
1. Go to [netlify.com](https://www.netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your `yuki-yaki-corner` repository

## 2. Build Configuration
**Auto-detected settings (verify these):**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18.x or higher

## 3. Environment Variables
Add these in "Advanced settings":
```
NODE_ENV=production
ADMIN_PASSWORD=your_admin_password
GEMINI_API_KEY=your_gemini_key (optional)
GITHUB_MODELS_API_KEY=your_github_key (optional)
```

## 4. Deploy & Test
1. Click "Deploy site"
2. Wait for build completion (2-5 minutes)
3. Test your app at the provided Netlify URL
4. Test image upload and admin panel

## 5. Post-Deploy
- Set up custom domain (optional)
- Enable HTTPS redirect
- Monitor usage in dashboard

**Your Yuki Yaki Corner app is now live! 🎉**

---

## Troubleshooting
- **Build fails**: Check deploy logs and fix TypeScript/lint errors
- **API not working**: Verify environment variables
- **404 errors**: Ensure using App Router structure
- **Admin 401**: Check ADMIN_PASSWORD environment variable

Need help? Check [Netlify docs](https://docs.netlify.com) or [Next.js deployment guide](https://nextjs.org/docs/deployment).