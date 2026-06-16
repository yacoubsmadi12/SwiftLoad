# SwiftLoad

A professional bilingual (Arabic/English) video and file downloader supporting YouTube, Instagram, TikTok, Twitter/X, Facebook, and direct links.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/swiftload run dev` — run the frontend (port 21557)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- API: Express 5
- Downloader: yt-dlp + ffmpeg (system packages)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas (used by server)
- `artifacts/swiftload/src/` — React frontend
- `artifacts/swiftload/src/hooks/use-language.ts` — bilingual i18n context (EN/AR)
- `artifacts/api-server/src/routes/downloader.ts` — download logic (yt-dlp)

## Architecture decisions

- **yt-dlp streams directly to browser** — no files stored on server. The `/api/download/stream?token=TOKEN` endpoint pipes yt-dlp stdout to the HTTP response.
- **Download tokens** — signed HMAC-SHA256 tokens (5-min TTL) encode URL+format, preventing abuse of the stream endpoint.
- **Bilingual without i18n library** — a custom `LanguageProvider` in `use-language.ts` holds all translations as a plain object. Arabic switches `document.dir` to RTL and font to Cairo.
- **Ad slots as styled divs** — three named slots (`ad-slot-top-banner`, `ad-slot-sidebar`, `ad-slot-below-download`) with dashed borders ready for Google AdSense `<ins>` tags.
- **LanguageProvider in `.ts` (not `.tsx`)** — JSX replaced with `React.createElement` to avoid esbuild treating it as TS-only.

## Product

- Paste any URL (YouTube, Instagram, TikTok, Twitter/X, Facebook, or direct file link)
- Auto-detect platform and fetch metadata via yt-dlp
- Choose format: MP4 (video), MP3 (audio), or original file
- Download streams directly to user's device
- Bilingual Arabic/English with RTL toggle
- Pages: Home, About, FAQ, Terms of Service, Privacy Policy
- AdSense-ready banner slots (top, sidebar, below download)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `use-language.ts` contains `React.createElement` (not JSX) because Vite/esbuild rejects JSX in `.ts` files. If you need to add JSX to a new hook file, use `.tsx` extension.
- yt-dlp + ffmpeg installed as Nix system packages — available on PATH.
- Always run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change before touching the frontend.
- The `SESSION_SECRET` env var is used for signing download tokens.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
