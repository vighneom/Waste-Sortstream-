# AI Recycling & Stream Purity System (CirculaSort)

High-throughput optical sorter intelligence and mill contamination avoidance platform.

## Vercel Deployment Guide

This project is fully configured for zero-configuration deployment to [Vercel](https://vercel.com).

### Method 1: Git Integration (Recommended)

1. Push or sync this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to your [Vercel Dashboard](https://vercel.com/new).
3. Click **"Add New..."** > **"Project"**.
4. Select and import this repository.
5. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**. Your application will be live with full SPA routing support.

---

### Method 2: Vercel CLI

You can also deploy directly from your local terminal using the Vercel CLI:

1. Install Vercel CLI globally or run with `npx`:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts to link and deploy to your Vercel account.
3. For production deployment:
   ```bash
   npx vercel --prod
   ```

---

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```
