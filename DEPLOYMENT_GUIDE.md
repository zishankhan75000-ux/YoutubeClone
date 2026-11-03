# YouTube Clone — Vercel Deployment Guide

This guide walks you through connecting your GitHub repository to **Vercel** and deploying the YouTube Clone web application with zero configuration.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- The repository pushed to GitHub: [https://github.com/zishankhan75000-ux/YoutubeClone](https://github.com/zishankhan75000-ux/YoutubeClone).

---

## 2. Recommended Vercel Configuration

The project already contains a `vercel.json` file in the root directory that configures the build:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "vite build",
  "cleanUrls": true
}
```

When importing the project into Vercel, the recommended project settings are:

| Setting | Recommended Value |
|---|---|
| **Framework Preset** | **Vite** |
| **Root Directory** | `./` (project root) |
| **Build Command** | `npm run build` (or `vite build`) |
| **Output Directory** | `.vercel/output/static` (or leave default) |
| **Install Command** | `npm install` |
| **Node.js Version** | **20.x** or **22.x** |

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Open Vercel Dashboard
1. Log in to [vercel.com](https://vercel.com).
2. Click the **"Add New..."** button in the top right corner and select **"Project"**.

### Step 2: Import GitHub Repository
1. Under **"Import Git Repository"**, search for `YoutubeClone` (or `zishankhan75000-ux/YoutubeClone`).
2. Click **"Import"**.

### Step 3: Configure Project Settings
1. **Project Name:** Keep as `youtube-clone` or choose your custom subdomain.
2. **Framework Preset:** Confirm that **Vite** is selected.
3. **Root Directory:** Leave as `./`.
4. **Environment Variables:** No environment variables or API keys are required for core functionality. (All video playback uses public embed endpoints and all user state persists in local browser storage).

### Step 4: Click Deploy
1. Click **"Deploy"**.
2. Vercel will execute `npm install`, compile the assets via `vite build`, and publish your application.
3. Once finished, you will receive a live URL (e.g., `https://youtube-clone-xxxx.vercel.app`).

---

## 4. Post-Deployment Verification Checklist

After the deployment finishes, verify the following in your live browser:

1. **Homepage:** Loads video grid, category chips, and top header navigation.
2. **Video Playback:** Navigate to `/watch?v=dQw4w9WgXcQ` and verify the video player embeds and plays smoothly.
3. **Direct Navigation:** Refresh the browser on `/watch?v=dQw4w9WgXcQ` or navigate directly to `/shorts` to verify that deep routing works without 404 errors.
4. **Theme Switcher:** Click your profile avatar in the header and toggle between Light and Dark themes.
5. **Interactive Actions:** Like a video, click "Subscribe", and add a comment to verify persistence.

---

## 5. Troubleshooting Common Issues

### Issue: Build Fails with Node Version Mismatch
- **Solution:** In Vercel Project Settings > General > Node.js Version, select **20.x** or **22.x**.

### Issue: Sub-routes return 404 on hard refresh
- **Solution:** Verify that `vercel.json` is present in the repository root. The included `vercel.json` and Nitro build output properly route all requests through the server entry.

---

## 6. Continuous Deployment

Every time you push new commits to the `main` branch of `https://github.com/zishankhan75000-ux/YoutubeClone`, Vercel will automatically trigger a new preview or production build.
