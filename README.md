This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important:** Add these Environment Variables in Vercel before deploying:
1. Go to your project on Vercel → **Settings** → **Environment Variables**
2. Add (any one of these for MongoDB):
   - `MONGODB_URI` = your MongoDB connection string (recommended)
   - `Mongoose_URI` or `DATABASE_URL` = alternative names (also supported)
   - `JWT_SECRET` = your secret key for JWT tokens

**Troubleshooting:**
- **MongoDB URI undefined:** Ensure env vars are set in Vercel and redeploy. For local dev, ensure `.env` exists in project root with `MONGODB_URI=...`
- **ERR_CONNECTION_REFUSED:** Usually means the server crashed due to missing env. Fix env loading first, then restart.
- **"buffering timed out" / 500 on Vercel:** In MongoDB Atlas → **Network Access** → add `0.0.0.0/0` (Allow from anywhere). Vercel uses dynamic IPs.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
