# CanonCore Deployment Guide

This document provides step-by-step instructions for deploying CanonCore to Vercel.

## 🚀 Deployment Status

**Current Status:** ✅ **DEPLOYED AND LIVE**

- ✅ **Vercel Project:** Created and configured
- ✅ **Environment Variables:** All Firebase config set
- ✅ **Build:** Successful deployment  
- ✅ **Live URL:** https://canoncore-nrxx80w1l-jacob-rees-projects.vercel.app
- ✅ **Authentication:** Vercel domain added to Firebase authorized domains

**Status:** ✅ **FULLY DEPLOYED AND OPERATIONAL** - All setup complete!

## Prerequisites

- GitHub repository with the code
- Vercel account (free tier available)
- Firebase projects (development and production)

## Quick Setup

### 1. Vercel Account Setup ✅ COMPLETED

1. ✅ Visit [vercel.com](https://vercel.com) and sign up with your GitHub account
2. ✅ Connect your GitHub account and grant necessary permissions

### 2. Create New Project ✅ COMPLETED

1. ✅ In Vercel dashboard, click "New Project"
2. ✅ Import the `canoncore-franchise` repository from GitHub
3. ✅ Configure the project settings:

**Framework Preset:** Next.js ✅
**Root Directory:** `./` (leave as default) ✅
**Build Command:** `npm run build` ✅
**Output Directory:** `.next` (default for Next.js) ✅

**Project Name:** `canoncore` ✅
**Project URL:** https://canoncore-nrxx80w1l-jacob-rees-projects.vercel.app ✅

### 3. Environment Variables ✅ COMPLETED

Added the following environment variables in Vercel via CLI:

#### Production Environment Variables ✅ SET
All Firebase configuration variables set via `npx vercel env add`:

```
✅ NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCkj13naWv5BOihLGK9Tmt3U1mqF_dTZN4
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=canoncore-694a5.firebaseapp.com
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID=canoncore-694a5
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=canoncore-694a5.firebasestorage.app
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=869167254359
✅ NEXT_PUBLIC_FIREBASE_APP_ID=1:869167254359:web:5027427d4c6179fd7f8c12
✅ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WQ1CJ19RZQ
```

### 4. Deploy ✅ COMPLETED

1. ✅ Deploy via CLI: `npx vercel --prod`
2. ✅ Build completed successfully (after fixing test file import issue)
3. ✅ Live at: https://canoncore-nrxx80w1l-jacob-rees-projects.vercel.app

## Firebase Production Setup

### 1. Create Production Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., `canoncore-prod`)
3. Enable Authentication and Firestore Database
4. Configure the same authentication providers as development
5. Copy the production Firebase config values

### 2. Deploy Firestore Rules

```bash
# From local development environment
firebase use --add  # Add the production project
firebase deploy --only firestore:rules --project production
firebase deploy --only firestore:indexes --project production
```

### 3. Set Up Authentication ✅ COMPLETED

1. ✅ In Firebase Console → Authentication → Settings
2. ✅ Add your Vercel domain to authorized domains:
   - `canoncore-nrxx80w1l-jacob-rees-projects.vercel.app` ✅ ADDED
   - Any custom domains you plan to use

**Status:** ✅ Authentication is now fully configured and working!

## Domain Configuration (Optional)

### Custom Domain Setup

1. In Vercel dashboard → Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Update Firebase authorized domains to include your custom domain

## Environment Management

### Development vs Production

- **Development:** Uses local Firebase project with `.env.local`
- **Production:** Uses production Firebase project with Vercel environment variables

### Environment Variables Security

- Never commit `.env.local` to version control
- Store production secrets in Vercel dashboard only
- Use different Firebase projects for different environments

## Deployment Commands

```bash
# Deploy to production
npm run deploy

# Deploy preview/staging
npm run deploy:preview

# Deploy to development environment
npm run deploy:dev
```

## Monitoring and Logs

### Vercel Dashboard

- **Functions:** Monitor serverless function performance
- **Analytics:** Track page views and performance
- **Logs:** View build and runtime logs

### Firebase Console

- **Authentication:** Monitor user sign-ups and activity
- **Firestore:** Monitor database usage and queries
- **Security Rules:** Review security rule evaluation

## Troubleshooting

### Build Failures

1. Check build logs in Vercel dashboard
2. Verify all environment variables are set correctly
3. Ensure TypeScript compilation passes locally

### Firebase Connection Issues

1. Verify Firebase config variables are correct
2. Check Firebase project permissions
3. Ensure authorized domains include your deployment URL

### Common Issues

**Build fails with TypeScript errors:**
- Run `npm run type-check` locally and fix any issues

**Firebase authentication doesn't work:**
- Add deployment domain to Firebase authorized domains
- Verify environment variables match Firebase project config

**Styling issues:**
- Tailwind CSS should work out of the box with Next.js on Vercel
- Check for any custom CSS compilation issues

## Performance Optimization

### Vercel Analytics

Enable Vercel Analytics in project settings for:
- Core Web Vitals monitoring
- Real user performance metrics
- Page load times

### Next.js Optimization

The `next.config.js` includes:
- Image optimization
- Bundle analysis
- Security headers
- Performance optimizations

## Security Considerations

### Environment Variables

- All Firebase config variables are prefixed with `NEXT_PUBLIC_` (client-side)
- No server-side secrets required for current architecture

### Security Headers

Security headers are configured in `next.config.js`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

### Firebase Security

- Firestore security rules control data access
- Authentication required for all user-specific operations
- Public read access only for public universes

## Support

For deployment issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Firebase documentation: https://firebase.google.com/docs
3. Next.js deployment guide: https://nextjs.org/docs/deployment