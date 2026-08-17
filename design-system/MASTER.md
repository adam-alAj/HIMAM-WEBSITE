# Himam — Master Design System

> **Single source of truth for every UI decision on the Himam website.**
> Every future phase **must** read this file before creating any UI. Extensions are
> additive and must stay consistent with this system; do not invent new colors,
> typography, button styles, spacing, radii, shadows, or visual patterns on the side.
> Token values live in `frontend/src/styles/tokens.css`; the two files must stay in sync.

**Version:** 1.0 — Phase 2 (design system + component library). No website pages exist yet.

---

## 1. Design principles

1. **Credible before clever.** The site sells software engineering trust to business
   owners and product leads. Every visual decision reinforces competence, not novelty.
2. **Blue and white only.** The entire brand identity is built from a structured blue
   scale on white. No purple, pink, orange, green, or red enters the core identity.
3. **Hierarchy through value, not decoration.** Depth comes from typography scale,
   spacing, and the blue scale — not from gradients, heavy shadows, or motion.
4. **Systems, not one-offs.** Components consume tokens. Reuse over invention.
5. **Accessible by default.** AA contrast, visible focus, full keyboard support,
   `prefers-reduced-motion` respected — non-negotiable, not a checklist afterthought.
6. **Calm motion.** Animation only where it improves feedback or wayfinding.

---

## 2. Color palette — blue & white

The palette is a single blue scale (tints → deep navy) on white. Colors are named by
their role; hex values are fixed. **Never add hues outside this scale.**

| Token | HEX | Usage |
| --- | --- | --- |
| `--color-white` | `#FFFFFF` | Primary surface: page backgrounds, cards, inputs |
| `--color-off-white` | `#F6F9FD` | Subtle separation surfaces (form areas, footer bands) — use sparingly |
| `--color-blue-50` | `#F0F6FC` | Very light blue: soft surfaces, information panels, hover fills |
| `--color-blue-100` | `#E1EEF9` | Light blue: section backgrounds, highlights, badge backgrounds |
| `--color-blue-200` | `#C4DCF0` | Light borders/divider accents on light-blue surfaces |
| `--color-blue-300` | `#9DC4E4` | Secondary blue: decorative fills, large non-text elements |
| `--color-blue-400` | `#5D9BD9` | Accent fills on dark surfaces; large decorative shapes only |
| `--color-blue-500` | `#2E6FC2` | Secondary interactive accents; blue text on very light fills |
| `--color-blue-600` | `#1F5FBF` | **Primary blue**: buttons, links, active states, focus rings |
| `--color-blue-700` | `#174E9F` | Primary hover: button/link hover |
| `--color-blue-800` | `#123E80` | Primary active/pressed state |
| `--color-blue-900` | `#0C2A57` | Dark blue: navbar, dark sections, strong brand areas |
| `--color-blue-950` | `#081B3A` | Ink navy: headings, body text on light, footer, darkest surfaces |

**Text colors**

| Token | HEX | Usage |
| --- | --- | --- |
| `--color-text-primary` | `#081B3A` | Headings + body on light surfaces |
| `--color-text-secondary` | `#3A4C66` | Supporting text, descriptions on light surfaces |
| `--color-text-muted` | `#5C6B83` | Captions, meta, placeholders, disabled-adjacent text |
| `--color-text-inverse` | `#FFFFFF` | Text on navy surfaces |
| `--color-text-inverse-muted` | `#A9BCD4` | Secondary text on navy surfaces |
| `--color-text-on-primary` | `#FFFFFF` | Text on primary blue buttons |

### Semantic colors (functional only)

For functional feedback **only** — success, warning, error — and always visually
subordinate to the blue identity (muted fills, never brand surfaces).

| Token | HEX | Usage |
| --- | --- | --- |
| `--color-success` | `#1E7A46` | Success text/icon; white text on success button |
| `--color-success-bg` | `#E6F3EC` | Success badge/surface fill |
| `--color-warning` | `#A05E03` | Warning text/icon; white text on warning button |
| `--color-warning-bg` | `#FBF1E1` | Warning badge/surface fill |
| `--color-error` | `#C23B2E` | Error text/icon, destructive actions; white text on error button |
| `--color-error-hover` | `#A43125` | Destructive button hover |
| `--color-error-active` | `#8C2A20` | Destructive button active/pressed |
| `--color-error-bg` | `#FBE9E7` | Error badge/surface fill, input error background |
| `--color-success/…-text` | see above | Text on soft fills always uses `--color-text-primary` / semantic 700-grade |

### Contrast (WCAG 2.1 AA, verified pairs)

| Pair | Ratio |
| --- | --- |
| `--color-text-primary` on `--color-white` | ~14.6:1 |
| `--color-text-secondary` on `--color-white` | ~8.3:1 |
| `--color-text-muted` on `--color-white` | ~5.4:1 |
| `--color-text-inverse` on `--color-blue-900` | ~14.9:1 |
| `--color-text-inverse-muted` on `--color-blue-900` | ~7.1:1 |
| `--color-text-on-primary` on `--color-blue-600` | ~6.0:1 |
| `--color-text-on-primary` on `--color-blue-700` (hover) | ~7.7:1 |
| `--color-text-primary` on `--color-blue-50` | ~13.4:1 |

All body text, labels, and interactive elements meet AA. Blue-300/400 are decorative
only and are never used for text on white.

**Rules**

- Blue-600 is the only "action" blue. Hover = blue-700, active = blue-800.
- Never use blue-400 or lighter for text on white (fails AA).
- On navy surfaces (900/950) use inverse text tokens, never blue text.
- Semantic colors may only appear in badges, input errors, and destructive buttons.

---

## 3. Typography

Two loaded families + a system mono stack for code. **Sora** carries identity
(display/headings); **Inter** carries readability (body/UI). Never use emoji or
decorative fonts as UI.

| Role | Family | Notes |
| --- | --- | --- |
| Display / headings | `--font-display: 'Sora', system fallback` | weights 600–700, tight tracking |
| Body / UI / inputs / buttons | `--font-sans: 'Inter', system fallback` | weights 400–600 |
| Code / technical | `--font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace` | system stack — no extra font download |

### Type scale (fluid where it matters)

| Token | Size / Line-height | Weight | Usage |
| --- | --- | --- | --- |
| `--text-display` | `clamp(2.5rem, 5vw, 4rem)` / 1.1 | 700 | Hero headlines only |
| `--text-h1` | `clamp(2rem, 3.5vw, 3rem)` / 1.15 | 700 | Page titles |
| `--text-h2` | `clamp(1.5rem, 2.5vw, 2.25rem)` / 1.2 | 700 | Section headings |
| `--text-h3` | `1.5rem` / 1.3 | 600 | Sub-sections, card titles |
| `--text-h4` | `1.25rem` / 1.35 | 600 | Minor headings |
| `--text-h5` | `1.125rem` / 1.4 | 600 | Card/list titles |
| `--text-h6` | `1rem` / 1.45 | 600 | Group headings |
| `--text-body-lg` | `1.125rem` / 1.65 | 400 | Intro/lead paragraphs |
| `--text-body` | `1rem` / 1.6 | 400 | Default body |
| `--text-body-sm` | `0.875rem` / 1.55 | 400 | Secondary text, meta |
| `--text-caption` | `0.8125rem` / 1.5 | 400 | Captions, footnotes |
| `--text-label` | `0.75rem` / 1.4, uppercase, `letter-spacing: 0.08em` | 600 | Eyebrows, field labels, tags |
| `--text-button` | `0.9375rem` / 1 | 600 | Button text (lg: `1rem`) |
| `--text-nav` | `0.9375rem` / 1 | 500 | Navbar links |
| `--text-code` | `0.875rem` / 1.6 | 400 | Code / technical text |

**Rules**

- Headings always use `--font-display` (Sora); body/UI always use `--font-sans` (Inter).
- Don't invent sizes between these steps; use the next token up or down.
- Don't set `font-family` inside components — tokens do it.
- `--text-label` is the only uppercase style in the system.

---

## 4. Spacing

4 px base grid. All component padding/margins/gaps come from these tokens.

`--space-0: 0` · `--space-0.5: 0.125rem` (2) · `--space-1: 0.25rem` (4) ·
`--space-1.5: 0.375rem` (6) · `--space-2: 0.5rem` (8) · `--space-2.5: 0.625rem` (10) ·
`--space-3: 0.75rem` (12) ·
`--space-4: 1rem` (16) · `--space-5: 1.25rem` (20) · `--space-6: 1.5rem` (24) ·
`--space-8: 2rem` (32) · `--space-10: 2.5rem` (40) · `--space-12: 3rem` (48) ·
`--space-16: 4rem` (64) · `--space-20: 5rem` (80) · `--space-24: 6rem` (96) ·
`--space-32: 8rem` (128)

Conventions: component internal gaps ≤ `--space-6`; section padding = `--space-16`→`--space-32` (fluid via `Section`); grid gaps `--space-4`–`--space-8`.

---

## 5. Border radius

| Token | Value | Usage |
| --- | --- | --- |
| `--radius-sm` | `6px` | Badges, small tags, chips |
| `--radius-md` | `8px` | Buttons, inputs, cards |
| `--radius-lg` | `12px` | Larger cards, modals, dropdown panels |
| `--radius-xl` | `16px` | Hero imagery, big surfaces |
| `--radius-full` | `9999px` | Pills, status dots, avatars |

Keep radii small-to-medium — this is a corporate brand, not a toy brand.

## 6. Borders

| Token | Value | Usage |
| --- | --- | --- |
| `--border-width` | `1px` | Default component borders |
| `--border-width-strong` | `2px` | Active states, emphasis outlines |
| `--color-border` | `#D6E2F0` (blue-200-ish) | Default borders on white |
| `--color-border-strong` | `#A9C4DE` | Borders that need more presence |
| `--color-border-on-dark` | `rgba(255,255,255,0.16)` | Dividers on navy surfaces |

## 7. Shadows

Subtle, cool-tinted (navy), low elevation — never heavy drop shadows.

| Token | Value | Usage |
| --- | --- | --- |
| `--shadow-xs` | `0 1px 2px rgba(8,27,58,0.05)` | Cards at rest |
| `--shadow-sm` | `0 1px 3px rgba(8,27,58,0.08), 0 1px 2px rgba(8,27,58,0.04)` | Hovered cards, small popovers |
| `--shadow-md` | `0 4px 12px rgba(8,27,58,0.10), 0 2px 4px rgba(8,27,58,0.06)` | Dropdowns, sticky navbar |
| `--shadow-lg` | `0 12px 28px rgba(8,27,58,0.16), 0 4px 10px rgba(8,27,58,0.08)` | Modals |
| `--shadow-focus` | `0 0 0 3px rgba(31,95,191,0.35)` | Focus ring on light surfaces (alt to outline) |
| `--shadow-focus-inverse` | `0 0 0 3px rgba(255,255,255,0.55)` | Focus ring on dark surfaces |
| `--shadow-focus-error` | `0 0 0 3px rgba(194,59,46,0.3)` | Focus ring on error inputs |

## 8. Container widths

| Token | Value | Usage |
| --- | --- | --- |
| `--container-narrow` | `720px` | Long-form text, forms |
| `--container` | `1200px` | Default page content |
| `--container-wide` | `1360px` | Header/footer bands, dense grids |

## 9. Breakpoints

| Token | Value | Device |
| --- | --- | --- |
| `--bp-mobile` | `375px` | Small phones (base styles target this) |
| `--bp-tablet` | `768px` | Tablets, large phones |
| `--bp-laptop` | `1024px` | Laptops / small desktops |
| `--bp-desktop` | `1440px` | Large desktops |

Media queries use the **literal px values** above (CSS custom properties are not
valid inside `@media`). Strategy: **mobile-first** — build at 375 px, scale up with
`min-width` queries. Components must scale naturally; only Navbar/Footer/grid layouts
get explicit breakpoint overrides. Avoid per-component micro-overrides.

## 10. Transitions & easing

| Token | Value | Usage |
| --- | --- | --- |
| `--duration-fast` | `120ms` | Hover states, color changes |
| `--duration-base` | `180ms` | Default transitions |
| `--duration-slow` | `280ms` | Modals, panels, menus |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default easing (decelerate) |
| `--ease-in-out` | `cubic-bezier(0.45, 0, 0.55, 1)` | Symmetric animations (modal fade) |

Transitions: `transition: color var(--duration-fast) var(--ease-out)` etc. Never
transition `width/height/top/left` where transform works.

## 11. Focus states

- Global rule (light surfaces): `:focus-visible { outline: 2px solid var(--color-blue-600); outline-offset: 2px; }`
- Dark/navy surfaces: `outline-color: #FFFFFF`.
- Modal trigger focus restoration is mandatory (see Modal).
- Focus must never be removed invisibly; mouse clicks use `:focus-visible` so no ring
  on click, always a ring on keyboard.

## 12. Z-index

| Token | Value |
| --- | --- |
| `--z-dropdown` | `1000` |
| `--z-sticky` | `1100` |
| `--z-modal` | `1300` |
| `--z-toast` | `1400` |
| `--z-skip-link` | `1600` |

## 13. Motion

- Purposeful only: feedback, state change, perceived responsiveness, hierarchy.
- Hover/focus: color + shadow at `--duration-fast`; no movement on plain buttons.
- Modals/menus: fade + slight scale (≤ 4 %) at `--duration-slow`, `--ease-in-out`.
- **`prefers-reduced-motion: reduce`** — global kill switch in `index.css` removes all
  animation/transition. Shimmer skeletons become static blocks. No exceptions.

## 14. Iconography

- A single stroke icon set (1.75 px stroke, 24 viewBox) — see `src/components/Icon/`.
- Sizes: 12 (badge icons), 14 (inline error icons), 16 (inline meta), 18 (social),
  20 (menu/inputs), 22 (brand marks), 24 (default), 32 (feature icons).
- `currentColor`; no multi-color icons, no emojis, no custom illustrated icon fonts.
- Decorative icons are `aria-hidden="true"`; icons that convey meaning get an
  `aria-label` via the `Icon` component's `label` prop.

## 15. Accessibility requirements (all components)

- AA contrast for all text and interactive elements (see §2 table).
- Every interactive element reachable and operable by keyboard; visible `:focus-visible`.
- Touch targets ≥ 40 × 40 px (44 px for icon-only controls); buttons/inputs min-height 40 px.
- Real `<button>`/`<a>` semantics; no `onClick` divs.
- Form fields: visible `<label>` associated via `htmlFor`/`id`; `aria-describedby` for
  hint/error; `aria-invalid` + `aria-required` where applicable.
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Escape to
  close, scroll lock, focus restore on close.
- No color-only communication: status badges pair dot/icon + text; errors pair icon + text.
- Text stays readable at all viewports; fluid type scales at §3.

## 16. Component library (contract)

Every component lives in `frontend/src/components/<Name>/` as `<Name>.tsx` +
`<Name>.module.css`. Components consume tokens only — **no arbitrary hex/px values
in component code**. Current library:

| Component | File | Variants / states |
| --- | --- | --- |
| Button | `Button/Button.tsx` | variants: `primary`, `secondary`, `ghost`, `danger`; sizes `sm/md/lg`; states: hover, active, focus-visible, disabled, loading (`aria-busy`, spinner), `fullWidth`, icon-only; renders `<button>`, `Link` (`to`), or `<a>` (`href`) |
| Card | `Card/Card.tsx` | variants: `default`, `subtle` (blue-50), `navy` (blue-900); `interactive` (hover lift + focus), `padding` sizes; whole-card clickable via `to`/`href` |
| Section | `Section/Section.tsx` | semantic `as` (`section/div/footer`), `background` (`default/subtle/light/navy`), `container` (`default/narrow/wide`), `padding` (`none/sm/md/lg`) |
| Badge | `Badge/Badge.tsx` | variants: `neutral`, `primary`, `light`, `outline`, `success`, `warning`, `error`; `dot` indicator; sizes `sm/md` |
| Input | `Input/Input.tsx` | label, hint, error, `disabled`, `required`, `aria` wiring, sizes `md/lg`, `textarea` |
| Navbar | `Navbar/Navbar.tsx` | sticky, brand, desktop links + CTA, mobile menu (hamburger, `aria-expanded`, closes on link click) |
| Footer | `Footer/Footer.tsx` | navy surface, link columns, social icons, copyright bar |
| Modal | `Modal/Modal.tsx` | portal-rendered, backdrop, `aria-labelledby`, focus trap, Escape, scroll lock, focus restore, sizes `sm/md/lg` |
| Skeleton | `Skeleton/Skeleton.tsx` | `width`/`height`/`radius`, shimmer (static under reduced motion), `aria-hidden` |
| Icon | `Icon/Icon.tsx` | ~30 stroke icons, sizes 12–32 (§14), `label` for accessible icons |

## 17. Usage rules for future phases

1. Read this file before any UI work. Design system > taste.
2. Use the component library; extend it only with a shared, token-based component —
   never inline one-off styles.
3. New values require a token first, then a MASTER.md row, then usage. No lone hex codes.
4. No new brand colors, fonts, button styles, spacing systems, radii, or patterns.
   Additive changes must match §1–§13.
5. Pages are assembled from `Section` + components. `/style-guide` is the visual QA
   environment — keep it rendered and current when components change.
