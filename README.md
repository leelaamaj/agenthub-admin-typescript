# AgentHub admin prototype

An interactive six-section AI-agent rental admin panel for 4Geeks. Public repository: https://github.com/leelaamaj/agenthub-admin-typescript

## Run

```sh
npm ci
npm run build
npm start
```

Open http://localhost:4173. Committed dist modules also run without Node after cloning: `python3 -m http.server 4173`. Internet access is required for Tailwind CDN. `npm run check` runs strict TypeScript; `npm test` builds and validates seed references and billing math.

## Assignment requirements

SPECS.md was committed separately before index.html. This repo was created using 4GeeksAcademy/html-hello. The teacher explicitly replaced vanilla JavaScript/no-build-tools with **vanilla TypeScript and a compiler workflow**. There is no frontend framework or backend; all styling uses Tailwind CDN utilities. src/ contains typed source, dist/ contains tsc browser output.

Dashboard, Users, Agents, Skills, Contracts and Error Log are available through the persistent sidebar. Row menus open detail/configuration windows. Prompt edits, confirmed deletions and error resolution affect session state. Reset demo restores seed records. Theme persists when browser storage is available. Native dialogs support keyboard focus, Escape, close buttons and backdrop dismissal. Agent skill lists have reduced-motion-aware disclosure transitions.

All identities, companies, errors and prices are fictional; billing period is explicitly November 2026. Historical names/prices are snapshots. No messages are sent, APIs called, real agents configured or real records deleted. Data mutations reset on reload.

## Design and verification

See docs/design-reference.md and docs/verification.md. Full specs were supplied to Google Stitch; generation is blocked by its new Terms of Service acceptance. This remaining coursework step is explicitly tracked, not marked completed. Tailwind's development CDN warning is expected for the required prototype and does not establish production readiness.

Template credit: [4GeeksAcademy/html-hello](https://github.com/4GeeksAcademy/html-hello).
