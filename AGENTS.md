# ClearField engineering guide

ClearField is a static HTML, CSS and vanilla JavaScript Minesweeper game. It has **no build system, backend, database, runtime AI integration, or application framework**. Do not add agents or skills for a small maintenance task.

## Read the smallest context

- For game rules and board generation: `js/game.js` plus the relevant README section.
- For interaction/timer/input bugs: `js/app.js` and `index.html`.
- For layout/accessibility: `css/styles.css`, `index.html` and existing `readme-assets/` screenshots.
- Read only the affected files. Keep exactly one writer; do not spawn role-based subagents for routine work.

## Technical boundaries

- Keep game logic and mine placement in `js/game.js`, independent from DOM access; the module also supports CommonJS testing.
- Keep DOM rendering, UI state, pointer/touch/keyboard handling and timers in `js/app.js`.
- Preserve safe-first-reveal behavior, board input validation, game terminal states and correct flag counts when changing core logic.
- Clean up event handlers and timers when restarting a game; prevent duplicate long-press and click actions.
- Preserve semantic control labels, keyboard navigation, focus and responsive layout. Do not introduce a build tool or dependency for a trivial UI change.
- Keep source attribution and the existing **MIT** license unchanged; do not apply an Apache-2.0 template from other repositories.

## Verification

Start from the repository root with `python3 -m http.server 8080`, then open `http://localhost:8080` in a browser. For a code change, manually verify desktop mouse, mobile/touch or emulation, and keyboard behavior **as relevant to the change**. If the rules change, exercise safe first reveal, winning, losing and custom board boundaries. No automated test suite is currently provided; do not claim one passed.

State the intended changes and focused checks before editing. Review the diff; do not commit, push or rewrite history without explicit approval. Avoid new business workflows, persistent accounts, storage layers or a general-purpose agent system without a user request.
