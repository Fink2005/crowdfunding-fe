# Vercel Deployment Guide

## Proxy Setup

`vercel.json` đã config proxy `/api/*` → `https://api.fundhive.pro.vn/*`

Frontend gọi `/api/...` → Vercel tự động forward tới backend.

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_WALLETCONNECT_PROJECT_ID=f09d9bdb0f586fadb3d6f3f05e78cfd4
VITE_CONTRACT_ADDRESS=0xF0FF7e67C2EBA417c7E0F0f8e1F8E7EA55c0aa73
```

## CORS Setup (Backend)

Backend vẫn cần enable CORS cho Vercel domain:

```javascript
// Backend CORS config
app.use(
  cors({
    origin: [
      'https://your-vercel-app.vercel.app',
      'https://vercel.app', // For all preview deployments
      'http://localhost:5173'
    ],
    credentials: true
  })
)
```

## Deploy Steps

1. Push code to GitHub (include `vercel.json`)
2. Connect repo to Vercel
3. Add environment variables
4. Deploy!

Vercel sẽ tự động proxy `/api` requests tới backend.
