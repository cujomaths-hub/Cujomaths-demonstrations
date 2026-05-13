# Cujomaths demonstrations

Static, embeddable maths applets (React via CDN + ES modules, no build step). Shared layout and components live under `shared/`.

## Theming (light / dark / system)

Students can pick **System**, **Light**, or **Dark**. The choice is stored in `localStorage` under the key `cujomaths-theme` and applied as `document.documentElement.dataset.theme` (`light` or `dark`). Implementation details are in `shared/ui/theme.js`.

When you add a **new applet page**, do the following so the theme applies before first paint and stays in sync with the OS when the user chooses System:

1. **Inline script in `<head>`** (before your main stylesheet link)  
   Copy the small IIFE from the top of `index.html` or `completing-the-square/index.html` that reads `localStorage`, resolves `system` via `prefers-color-scheme`, and sets `dataset.theme` / `dataset.themeSetting` on `document.documentElement`.

2. **Stylesheet**  
   Link `shared/styles.css` (adjust the relative path from the applet folder). Colours and surfaces are driven by CSS variables that switch under `[data-theme="dark"]`.

3. **Control in the UI**  
   - **React applets:** import `ThemeSelect` from `shared/ui/applet-ui.js`, render it in the header or toolbar, and pass a unique `id` for the `<select>` (for example `id="my-applet-theme"`).  
   - **Plain HTML pages:** mirror the pattern at the bottom of root `index.html`: a `<select>` plus a `type="module"` script that imports `initThemeFromStorage`, `applyThemeSetting`, `attachSystemThemeListener`, and `getStoredThemeSetting` from `shared/ui/theme.js`.

4. **Prefer shared class names** (`hero`, `card`, `muted`, `working`, and so on) instead of hard-coded colours so dark mode stays consistent.

KaTeX (where used) picks up text colour via `.katex { color: var(--cm-katex); }` in `shared/styles.css`.

## Shareable URL state

`shared/ui/url-state.js` holds small **read / build** pairs per applet (query param names are the “schema” for that page):

- **Completing the square:** `readCompletingTheSquareState(search, EXAMPLES)` and `buildCompletingTheSquareQuery(state, EXAMPLES)` — `mode`, `p`, `c`, `ex`, `practice`, `teacher`, `tab`, `demo`.
- **Point to plane:** `readPointToPlaneState(search, PLANE_EXAMPLES)` / `buildPointToPlaneQuery(state, PLANE_EXAMPLES)` — `mode` (`unsupported` with `pdef`, `abcd`, `pp`, `nv`, `tA`–`tC`, `P`, `rx`, `ry`), `ex` (supported example index when geometry matches a preset), `practice` (`unscaffolded`), plus `teacher`, `tab`, `method`, `demo` as on the line page.
- **Point to line:** `readPointToLineState(search, LINE_EXAMPLES)` / `buildPointToLineQuery(state, LINE_EXAMPLES)` — `mode` (`unsupported` with `P`, `A`, `v` as comma triplets), `ex` (supported example index), `practice` (`unscaffolded`), plus `teacher`, `tab`, `method`, `form`, `demo` as before.
- **Parabola standard form:** `readParabolaStandardState` / `buildParabolaStandardQuery` — `mode` (`unsupported` with `a`, `b`, `c`), `ex` when the triple matches a preset, plus `practice`, `teacher`, `tab`, `demo`.
- **Parabola turning-point form:** `readParabolaVertexState` / `buildParabolaVertexQuery` — `mode` (`unsupported` with `a`, `h`, `k`), `ex` when the triple matches a preset, plus `practice`, `teacher`, `tab`, `demo`.

Use `replaceHistoryQuery(queryString)` after state changes (skip the first effect pass if you mirror the completing-the-square pattern with a ref) so the address bar stays shareable. Plain pages can combine this with a **Copy link** button.

## Scaffolded practice steps

`shared/ui/scaffold-steps.js` exports:

- **`StepInput`** — titled step card with optional equals-prefix row, hint, and check feedback.
- **`ScaffoldedStepList`** — renders an array of `{ id?, when?: () => boolean, render: () => ReactNode }` so conditional steps (for example a radicand step only after “yes”) stay declarative.

New applets can reuse the same list pattern without copying the completing-the-square markup.

## Shell pattern (tabs)

Exploration applets use a common shell: **Student** tab, **How to use** (`InstructionsDetails` from `shared/ui/applet-ui.js`), optional **Teacher resources** when **Teacher mode** is on (`TeacherModeToggle`), plus **Theme** and **Copy link** in the hero. See the geometry demos and completing-the-square for reference.
