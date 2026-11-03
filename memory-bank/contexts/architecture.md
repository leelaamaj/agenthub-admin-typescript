# Architecture

index.html provides semantic shell and native dialog; src/data.ts owns typed fictional records and money calculations; src/ui.ts owns common rendering; src/app.ts owns routes and interactions. tsc emits ES modules to dist. Tailwind loads via CDN and handles every visual style. State mutations are in-memory; theme alone persists. Snapshot names/prices in contracts and errors survive demo deletions.
