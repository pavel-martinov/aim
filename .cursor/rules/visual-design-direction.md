---
description: UI visual direction and inspiration — Premium Health Tech aesthetic, hybrid theme
alwaysApply: true
---

# AIM Visual Design Direction

**Use this rule when:** Designing or styling any UI component, section, or page. Apply the visual language below to keep the site cohesive with premium health/wellness aesthetics.

## Inspiration Sources

| Site | Style Notes |
|------|-------------|
| **Superpower** | Dark mode, vibrant gradients (orange/blue), bento grids, biomarker/data visualization, glowing orbs |
| **Ultrahuman** | Product-focused, sleek data overlays, clean minimalism, premium feel |
| **Oura / WHOOP** | Wearable tech aesthetic, lifestyle imagery, clear data hierarchy |
| **Function Health** | Clinical clarity, editorial typography, high contrast, “100 healthy years” authority |
| **Heva Health** | Category-driven navigation, treatment cards, trust signals |
| **Quantum Body / Humane Space** | Ethereal gradients, curiosity/awe themes, abstract patterns |

---

## Theme Strategy: Hybrid

- **Hero & Feature Blocks:** Dark, immersive (`bg-zinc-950`, `bg-black`) — high impact, focused attention
- **Content & Data Blocks:** Light, clean (`bg-white`, `bg-zinc-50`) — readability, clinical trust
- Alternate sections for visual rhythm and magazine-style pacing

---

## Key UI Patterns

### Bento Grids

Use asymmetric, content-dense grids for features and product highlights.

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

- Mix large feature cards with smaller supporting cards
- Span 2 columns for hero features; 1 column for secondary items

### Glassmorphism

Overlays and floating elements:

- `backdrop-blur-md` or `backdrop-blur-xl`
- `bg-white/5` (dark sections) or `bg-black/5` (light sections)
- `border border-white/10` (dark) or `border border-black/10` (light)

### Gradients & Glows

- Radial gradients for hero backgrounds: `bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_45%)]`
- Subtle accent glows: `shadow-[0_0_60px_rgba(255,255,255,0.08)]`
- Biomarker/tech feel: soft orange/blue/purple gradients for highlights

### Typography (Magazine-Style)

- Headlines: `tracking-tight`, `font-semibold`, `text-balance` — editorial impact
- Body: `leading-relaxed`, `text-white/70` (dark) or `text-zinc-600` (light)
- Labels/Kicker: `text-xs uppercase tracking-[0.35em] text-white/60` or `text-black/50`

---

## Tailwind Tokens

| Use | Classes |
|-----|---------|
| Dark background | `bg-zinc-950`, `bg-black` |
| Light background | `bg-white`, `bg-zinc-50` |
| Card radius | `rounded-2xl`, `rounded-3xl` |
| Button radius | `rounded-full` for pills |
| Borders (dark) | `border-white/10`, `border-white/20` |
| Borders (light) | `border-black/10`, `border-zinc-200` |
| Text muted (dark) | `text-white/60`, `text-white/70` |
| Text muted (light) | `text-zinc-600`, `text-black/60` |
| Shadows | `shadow-[0_20px_60px_rgba(0,0,0,0.08)]`, `shadow-[0_40px_120px_rgba(0,0,0,0.45)]` |

---

## Imagery

- High-quality product or lifestyle photos where applicable
- Use `next/image` with `object-cover` and aspect ratios (`aspect-video`, `aspect-square`)
- Parallax for hero imagery when it adds depth (use `ParallaxSection`)
- Abstract patterns or gradients when no photo is available

---

## Quick Checklist

- [ ] Hero/intro: Dark background, strong headline, CTA visible
- [ ] Feature blocks: Bento grid or card layout, glassmorphism on dark
- [ ] Content blocks: Light background, readable body text
- [ ] Cards: `rounded-2xl`+, subtle border, backdrop blur on dark
- [ ] CTAs: Rounded-full buttons, clear hover states
