# ADR-001: Core Stack — Supabase + Vercel + Bunny.net

**Status:** Accepted
**Date:** 2026-05
**Decided by:** Dev

## Context

The Divyakala LMS is moving from demo to a real production platform expected to serve thousands of users with significant video content. Needed a stack decision that balances scale, cost, and the reality of a solo builder.

## Decision

- **Frontend:** React + Vite, deployed on **Vercel**.
- **Backend (database, auth, storage for images/PDFs):** **Supabase** (Postgres).
- **Video hosting/streaming:** **Bunny.net** (Bunny Stream).
- **Payments:** Razorpay (INR) + Stripe (international) — to be integrated later.
- **Error monitoring:** Sentry (free tier).

## Why

- Vercel does not run the backend — it serves the static React app. The backend is Supabase. This is a standard, proven SaaS architecture that scales to thousands of users without issue.
- Supabase Postgres scales fine to tens of thousands of users. Supabase Auth and Storage cover auth and non-video files.
- Video does not belong in Supabase Storage — it is large and needs streaming/CDN. Bunny.net is purpose-built for this, affordable, and performs well in India.
- Total infra cost at scale (1000+ students): ~$35-60/month. Client has agreed to cover this.

## Alternatives Rejected

- **AWS S3 / raw AWS for storage and video** — cheaper per GB but expensive in engineering time. Would require hand-building auth, signed URLs, transcoding, streaming. Not worth it for a solo builder at this scale.
- **Keeping video in Supabase Storage** — wrong tool; storage is not a streaming CDN, and the free tier (500MB) is trivially exceeded by video.
- **Mux for video** — strong option, premium pricing. Kept as a fallback if Bunny.net proves fiddly.

## Consequences

- Easy: fast development, managed infrastructure, low ops burden.
- Watch out for: if a heavy always-on server process is ever needed (e.g. custom transcoding pipeline), a small worker service must be added — Vercel serverless is not for long-running jobs. Not expected to be needed.
- If Supabase Pro tier is ever outgrown (unlikely under ~10k users), Postgres can migrate to managed Postgres elsewhere without changing the app architecture.

## Related

- ADR-002 (docs in repo)
- HANDOFF.md Section 3
