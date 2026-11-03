# AgentHub admin panel specification

## Product and constraints
AgentHub rents preconfigured AI agents to businesses. Internal administrators review customers, agents, skill capabilities, contracts and execution failures. This deliverable is an interactive frontend prototype with fictional hardcoded data, not a working rental service.

Use semantic HTML, Tailwind via CDN, vanilla TypeScript compiled to browser JavaScript with tsc. No React, Vue, jQuery, backend, API calls, custom CSS files or inline style attributes. The teacher explicitly overrides the original vanilla-JavaScript/no-build-tools requirements with vanilla TypeScript and a minimal compiler workflow. Commit this specification before adding the first application HTML.

## Design system and shell
Use an ink/slate sidebar, pale slate canvas, white panels, violet accents and compact outlined icons. Main typography is a system sans stack. Desktop sidebar is 240px; tablet sidebar is 80px with accessible names and icons. At narrow widths use horizontal scrolling within tables, never the entire page. Top bar contains the current section, prototype label and theme toggle. Dashboard is the initial route. Sidebar persists and marks the active item with aria-current. Navigation uses hashes; Back/Forward works. Page headings are h1, panel headings h2.

## Dashboard
1. Four responsive cards show this month's total revenue, discount/coupon losses, active agents and failing agents. Each includes an icon, descriptive label and value. Revenue is the sum of current-month contract totals; discounts sum current-month contract discounts; agent counts reflect the current non-deleted agent list.
2. Place cards in four desktop columns, two tablet columns and one narrow-screen column. Use distinct violet, amber, teal and rose icon treatments with readable text labels.
3. Below cards show a full-width weekly activity placeholder with dashed border and explicit placeholder text, not fabricated chart data. Also show a compact agent-status list with links to Agent Management and an error summary linking to Error Log.

## User Management
1. A semantic table starts with five users, displaying name, email, plan and status badge. Fictional emails use example.com. Display record count and an explicit empty state if all are deleted.
2. Each row has a named vertical-ellipsis action button toggling View detail/Delete. Menus close on second click, outside click, Escape or navigation; opening one closes the previous menu.
3. View detail opens a titled modal containing ID, name, email, plan, status and join date. Delete asks for confirmation in a modal and removes the local user; existing agent/contract owner snapshots remain readable. Reset demo restores seed data.

## Agent Management
1. Start with four agents, each showing name, owner, purpose, status active/inactive/failing and a collapsed skill disclosure. Status includes text as well as color.
2. Skill disclosure starts closed, uses aria-expanded and aria-controls, and reveals all associated skills with a height/opacity transition. Respect reduced-motion. Closing hides contents from keyboard and accessibility navigation.
3. Every agent has Configure/Delete actions. Configure opens a modal with labeled editable system-prompt textarea, Cancel and Save changes. Reject whitespace-only prompt with an inline error; save affects local state. Delete requires confirmation and removes only the agent; historical contracts/errors retain agent-name snapshots.

## Skills
1. Start with four skills (Web research, Document analysis, Calendar management, Email drafting), showing name, description and count of remaining agents enabling each skill.
2. Explain in-panel that a skill is a capability attached to an agent, rather than the agent itself. Use an open table/list with description and usage columns.
3. Each skill has View detail/Delete actions. Detail shows ID, description, price and enabled agents. Deleting confirms and detaches it from current agents while preserving contract snapshots and their prices. Empty catalog has explicit text.

## Agent Contracts
1. Start with four rental contracts, including active and past, showing client, agent, contracted skill names, start/end dates, status and total paid in USD. All records reference consistent seeded entities.
2. Each row has View detail action opening a modal with full dates, contract ID, client/agent names, itemized skills and individual prices, agent base fee, discount and final total.
3. Compute total as base fee + sum(skill prices) - discount using integer cents. Historical itemized prices and labels are immutable snapshots. Table footer shows total paid for listed contracts; empty states are explicit.

## Error Log
1. Start with six errors showing ISO-derived readable timestamp, known agent name, error type, severity badge, description and resolved/open state. Use critical, warning and info text badges with rose/amber/blue treatments.
2. Each entry has View detail/Mark as resolved actions. Detail shows full trace in a wrapping or horizontally scrollable pre element, plus timestamp, type and state.
3. Resolving changes local state and updates open-issue counts; already resolved entries show a disabled Resolved action. Resolution does not automatically change the agent's separately managed status. Empty error log has explicit text.

## Reusable component inventory
Persistent sidebar and top bar; heading/count; metric card; status/severity badge; action dropdown; semantic scrollable table; agent skill disclosure; native dialog modal; confirmation dialog; labeled textarea; theme toggle; live status notification; reset-demo control; empty state.

## Global behavior and data
Use typed User, Agent, Skill, RentalContract, ContractSkill and AgentError records with stable IDs. Seed five users, four agents, four skills, four contracts and six errors. Current billing month is explicitly November 2026 demo data, not the viewer's live accounting month. TypeScript constants define this period. Local mutations last for the page session; theme persists via localStorage when available, falling back gracefully if blocked. Reset restores fictional records and closes overlays. No network save or real deletion occurs.

Modal uses native dialog.showModal, accessible title, close button, backdrop click and Escape; focus returns to opener (or safe heading if removed). Only backdrop clicks close, not content clicks. Buttons have visible focus utilities. Menus support normal Tab navigation and Escape; aria-expanded reflects state. Icons are decorative SVG and hidden from assistive technology. Dark mode uses a root dark class with Tailwind dark utilities and preserves contrast across all surfaces. Use Tailwind v3 CDN configuration darkMode:'class'. No third-party UI runtime.

## Numbered acceptance criteria
1. Git history contains this spec-only commit before first index.html implementation commit.
2. Six sidebar routes work, active state follows route, and browser Back/Forward restores sections.
3. Initial counts are at least 5 users, 4 agents, 4 skills, 4 contracts, 6 errors.
4. Dashboard has all four labeled metric cards and explicitly labeled weekly chart placeholder.
5. Every data row/card has a working ellipsis action menu; second click, outside click, Escape and navigation close it.
6. Users, skills, contracts and errors each open full detail modals; Configure opens the editable agent prompt.
7. Modals close via close button, backdrop and Escape; content clicks stay open and focus is restored.
8. Agent skills are initially collapsed and toggle with visible transition, correct aria-expanded and reduced-motion support.
9. Theme changes the entire panel and remains selected across sections and page reloads when storage is available.
10. Delete requires confirmation; Cancel preserves data; confirm updates the list/counts without broken historical labels.
11. Nonempty prompt edits save locally; whitespace-only input has clear validation and cannot save.
12. Resolve changes error state/counts and is idempotent; dashboard error count follows it.
13. Contract itemized prices sum exactly to base + skills - discount; amounts use USD formatting.
14. Desktop 1440px and tablet 768px layouts remain readable without page-level horizontal overflow; verify a narrow phone layout too.
15. All controls are keyboard-reachable, dialogs trap focus natively, and status changes are announced via a live region.
16. Strict tsc passes; browser has no application errors. HTML uses nav/header/main/section/table semantics; no custom CSS files or style attributes.
17. Google Stitch receives this spec for the required visual proposal; record the proposal or the precise access blocker honestly.
18. README documents build/serve, fictional session data, teacher override, verification and public repository URL.

## Implementation sequence
Spec commit → Stitch proposal/design reference → TypeScript seed data and reusable shell → sections/interactions → compiler and rendered desktop/tablet/keyboard checks → verification evidence and delivery. Do not substitute a design screenshot for real UI.
