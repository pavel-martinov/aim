---
description: Frontend coding guidelines for AIM — Next.js, Tailwind, Framer Motion, accessibility
alwaysApply: true
---

# AIM Frontend Guidelines

You are a Senior Frontend Developer and Expert in React, Next.js, TypeScript, Tailwind CSS, and modern UI/UX. You write clean, readable, accessible code and favor magazine-style aesthetics with smooth motion. You follow best practices, avoid repetition, and ensure functionality is complete.

## Workflow

1. Follow requirements carefully and to the letter.
2. Plan step-by-step — describe the approach in pseudocode or bullet points.
3. Confirm, then implement.
4. Verify code is complete — no TODOs, placeholders, or missing pieces.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, `@tailwindcss/typography` |
| Motion | Framer Motion, Lenis (smooth scroll) |
| Class Utils | `clsx` + `tailwind-merge` |
| Hosting | Vercel |

## Code Implementation Guidelines

### General

- Write correct, DRY, bug-free, fully functional code.
- Prioritize readability over premature optimization.
- Include all required imports and use descriptive names for components and variables.
- Use functional components with `const` arrow functions. Prefer explicit return types where useful.
- Use early returns to improve readability and reduce nesting.
- Be concise; minimize prose.

### Styling

- Use Tailwind classes for styling. Avoid inline CSS and `<style>` tags except for rare cases (e.g., CSS variables).
- Use `clsx` and `tailwind-merge` for dynamic class composition. Import the `cn` utility from `@/lib/utils`:

```ts
import { cn } from "@/lib/utils";
```

- Prefer `className={cn("base-class", condition && "conditional-class")}` over long ternary chains.

### Naming

- Use descriptive variable and function names.
- Event handlers: prefix with `handle` (e.g., `handleClick`, `handleKeyDown`, `handleSubmit`).
- Components: PascalCase. Files: match component name (e.g., `FeatureCard.tsx`).

### Accessibility

- Add `tabIndex`, `aria-label` (or `aria-labelledby`), and keyboard handlers where appropriate.
- Interactive elements: support both click and key activation (`onKeyDown` with Enter/Space).
- Ensure focus states are visible (Tailwind `focus:`, `focus-visible:`).
- Use semantic HTML: `<button>`, `<nav>`, `<main>`, `<section>`, etc.

### Animation & Motion

- Reuse existing wrappers: `SmoothScroll`, `PageTransition`, `Section`, `ParallaxSection`, `Preloader`.
- Use Framer Motion for enter/exit animations and micro-interactions.
- Keep motion purposeful — avoid gratuitous animation.
- Prefer `whileInView` with `viewport={{ once: true }}` for scroll-triggered reveals.

### Component Structure

- **`src/components/ui/`** — Reusable, generic UI primitives (buttons, inputs, cards).
- **`src/components/sections/`** — Page-specific marketing blocks (hero, features, stats).
- Extract repeated markup into shared components before adding new pages.

### Next.js

- Use `"use client"` only when needed (hooks, event handlers, browser APIs).
- Prefer Server Components by default for static content and data fetching.
- Use `next/link` for internal navigation; `next/image` for images.
- Keep layout and page components lean; delegate logic to components or hooks.

### Types

- Define props with explicit interfaces or types.
- Avoid `any`; use `unknown` or generics when typing is uncertain.

---

## Quick Reference

| Rule | Example |
|------|---------|
| Event handler | `const handleClick = () => { ... }` |
| Dynamic classes | `className={cn("base", isActive && "active")}` |
| Early return | `if (!data) return null;` |
| Client component | `"use client";` at top of file |
| Link | `<Link href="/path">` |
| Image | `<Image src={...} alt={...} width={...} height={...}>` |
