This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local dashboard links

Run each dashboard app in its own terminal, then configure the hub URLs so the cards link to the right ports.

Recommended dev URLs:

```
NEXT_PUBLIC_BETTI_SENIOR_URL=http://localhost:3001
NEXT_PUBLIC_BETTI_CAREGIVER_URL=http://localhost:3002
NEXT_PUBLIC_BETTI_EMS_URL=http://localhost:3003
NEXT_PUBLIC_BETTI_SECURITY_URL=http://localhost:3004
NEXT_PUBLIC_BETTI_FIRE_URL=http://localhost:3005
```

Add these variables to your local environment (for example, via `.env.local`) before running `npm run dev`.

## Production deployment

For production, set the following environment variables so dashboard links and logout work correctly.

### Central Hub (main app on port 3000)

**Option A – Path-based URLs** (e.g. `https://app.example.com/senior`):

```
NEXT_PUBLIC_DASHBOARD_BASE_URL=https://app.example.com
```

**Option B – Individual dashboard URLs** (e.g. separate domains or subdomains):

```
NEXT_PUBLIC_BETTI_SENIOR_URL=https://senior.example.com
NEXT_PUBLIC_BETTI_CAREGIVER_URL=https://caregiver.example.com
NEXT_PUBLIC_BETTI_EMS_URL=https://ems.example.com
NEXT_PUBLIC_BETTI_SECURITY_URL=https://security.example.com
NEXT_PUBLIC_BETTI_FIRE_URL=https://fire.example.com
NEXT_PUBLIC_BETTI_OPERATOR_URL=https://operator.example.com
```

### Each dashboard app (Senior, Caregiver, EMS, Security, Fire, Operator, Admin)

So logout / "Back to Hub" goes to the correct URL:

```
NEXT_PUBLIC_CENTRAL_HUB_URL=https://app.example.com
```

Set this in each dashboard’s deployment environment (Vercel, etc.). Without it, dashboards fall back to `http://localhost:3000`, which will be wrong in production.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
