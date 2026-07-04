# Design Brief

## Direction

Refined Editorial — a warm-neutral portfolio canvas with a single deep ocean-blue accent, clean grid, and confident typographic hierarchy.

## Tone

Refined minimalism executed with conviction: warm cream background, crisp white cards, one accent color used sparingly — premium without being sterile.

## Differentiation

A warm cream canvas (not pure white) paired with a deep ocean-blue accent and cool teal secondary — rejects both the "black/white portfolio" cliché and the "purple gradient tech" cliché.

## Color Palette

| Token      | OKLCH            | Role                          |
| ---------- | ---------------- | ----------------------------- |
| background | 0.98 0.008 75    | warm cream canvas            |
| foreground | 0.18 0.012 260   | deep neutral text             |
| card       | 1.0 0.0 0        | pure white elevated surfaces  |
| primary    | 0.45 0.16 240    | deep ocean blue (CTAs, links) |
| accent     | 0.6 0.13 195     | cool teal (highlights only)   |
| muted      | 0.95 0.012 75    | secondary surfaces, footers   |

## Typography

- Display: Space Grotesk — headings, hero, nav, tight tracking
- Body: Figtree — paragraphs, UI labels, descriptions
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base text-lg`

## Elevation & Depth

Pure white cards on warm cream create natural separation; soft elevated shadows (`shadow-elevated`) on cards and modals, no shadows on flat sections.

## Structural Zones

| Zone    | Background       | Border      | Notes                              |
| ------- | ---------------- | ----------- | ---------------------------------- |
| Header  | `bg-card`        | `border-b`  | sticky, slight blur, subtle shadow |
| Hero    | `bg-background`  | —           | subtle gradient orb decoration     |
| Projects| `bg-muted/30`    | —           | alternating section                |
| About   | `bg-background`  | —           | profile + bio + skill tags         |
| Contact | `bg-muted/30`    | —           | form + links                       |
| Footer  | `bg-muted/50`    | `border-t`  | copyright + quick links            |

## Spacing & Rhythm

Generous: `py-20 md:py-28` section gaps, `gap-6 md:gap-8` card grids, `space-y-4` content groups, `tracking-tight` on headings.

## Component Patterns

- Buttons: primary `bg-primary text-primary-foreground rounded-md`, hover darkens 5%; secondary outlined `border-border`
- Cards: `bg-card rounded-lg shadow-elevated border border-border/50`, hover lifts with `shadow-elevated-lg`
- Badges: pill `rounded-full bg-secondary text-secondary-foreground text-sm`, skill tags
- Links: `text-primary` with underline-on-hover

## Motion

- Entrance: fade-up stagger on sections, 0.4s ease-out
- Hover: cards lift `translate-y-1` + shadow grow, 0.3s smooth
- Decorative: subtle gradient orb slow drift (20s linear infinite)

## Constraints

- One accent color only (ocean blue); teal used sparingly for secondary highlights
- No purple gradients, no default Tailwind blue, no full-page gradient backgrounds
- Light mode primary; dark mode supported but not toggled by user
- Max 3 fonts: Space Grotesk + Figtree + Geist Mono

## Signature Detail

Warm cream canvas (#FAF8F4-feeling) instead of pure white — gives the entire portfolio a tactile, editorial warmth that pure-white portfolios lack, while the ocean-blue accent stays crisp and modern.
