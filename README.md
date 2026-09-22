# Tawas3 MVP

Web platform for **GCC localization guidance** and a **company marketplace** (Bahrain & GCC focus).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Demo flow

1. **Landing** — choose Admin, Company, or browse as a Visitor (stored in `localStorage` via Zustand persist).
2. **Company** — demo user `u-company-1` (Gulf Thread). Create/edit profile, request roadmaps, simulate package purchase.
3. **Admin** — approve pending listings (e.g. Nexus AI), edit packages, view roadmap log.
4. **Visitor** — browse approved companies, open profiles, mock contact.

## Architecture

- **UI:** React 19 + TypeScript, React Router, Tailwind v4 with custom tokens in `src/design/tokens.css`
- **State:** Zustand + persist (`src/store/useAppStore.ts`)
- **Roadmaps:** `src/services/localizationRulesEngine.ts` — rules/lookup by domain × country (swappable for LLM later)

## Routes

| Path | Role |
|------|------|
| `/` | Landing + role picker |
| `/admin` | Admin dashboard |
| `/company/onboarding` | Company profile form |
| `/company/dashboard` | Roadmaps, status, package usage |
| `/company/pricing` | Tier selection (mock payment) |
| `/visitor/browse` | Search/filter directory |
| `/visitor/company/:id` | Public profile |
