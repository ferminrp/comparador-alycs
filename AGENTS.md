<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a single, static frontend-only Next.js 16 app (no backend, database, or env vars). Data is bundled in `data/alycs.json`. Scripts live in `package.json`; see `README.md`.

- Dev server: `npm run dev` (Turbopack) serves on http://localhost:3000. Build: `npm run build` produces a static export to `out/` (`next.config.ts` uses `output: "export"`).
- No test suite exists; verification is lint + build + manual UI check.
- Known caveat: `npm run lint` currently fails on a pre-existing error in `components/ComparisonTable.tsx` (`react-hooks/set-state-in-effect`). This is unrelated to environment setup — do not treat it as a setup regression.
