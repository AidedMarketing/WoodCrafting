---
version: alpha
name: WoodCrafting
description: A personal whittling workbench with a tactile wood model on a cool drafting surface.
colors:
  primary: "#204e51"
  ink: "#263b3e"
  muted: "#5d7072"
  background: "#f7f9f8"
  surface: "#ffffff"
  line: "#d9e2e0"
  model: "#e5edec"
  accent: "#a66b36"
typography:
  sans:
    fontFamily: "'Avenir Next', Avenir, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
  mono:
    fontFamily: "ui-monospace, monospace"
rounded:
  DEFAULT: "12px"
  sm: "8px"
  lg: "16px"
spacing:
  section-gap: "30px"
  page-max: "1480px"
components:
  button: {}
  viewer: {}
  stage: {}
  checkpoint: {}
---

# WoodCrafting Design System

## Overview

### Creative North Star

A wood sample on a cool drafting table beside a practical field guide. The library opens with model-derived project previews; each lesson centers the manipulable carving. The model's warm material contrasts with a silver-blue work surface; deep petrol marks actions.

### Product context and register

- Audience: one adult beginning whittling, no equipment or experience.
- Usage: iPhone and iPad beside a workbench, frequent short checks.
- Locale: English; inches with approximate millimeters. No market inferred from device or locale.
- Register: personal learning tool, not a marketing site.
- Signature: continuous geometry progression with a before/after scrubber.
- Restraint: plain navigation, no gamified streaks, timing pressure, or fake projects.
- Anti-references: shopping catalogs, game simulators, ornamental dashboards.
- Evidence: user brief and sources in src/lesson.ts; instructional caveats in README.md.
- Ownership: src/style.css :root is the canonical runtime token source. The frontmatter mirrors those durable tokens. Review both together when changing palette; no second theme adapter exists.

## Colors

Primary is for enabled principal actions and selected controls; accent supports cut numbering and focus. Ink/muted distinguish instruction hierarchy. Model is the viewing surface; white is instructional content. A light theme is intentional. Forced colors restore native system semantics.

## Typography

Georgia titles evoke printed workshop books. Avenir/system sans keeps instructions familiar and offline. No external font request or late font swap. Regular instructions use 14–16px; secondary metadata is 12px, with a few compact mobile captions at 11px. Body line height is 1.6. Labels name actions in sentence case.

## Layout

1480px maximum, 4% page gutters. Desktop uses a wider model and a reading column; under 740px they stack with 5% gutters. The document owns scrolling. Two-column stage tiles on phones keep every stage reachable without sideways scrolling. Controls have at least 44px targets except secondary compact actions. Safe bottom padding accounts for installed iOS mode.

## Elevation & Depth

A single bordered workbench joins model and instruction. Shadows are restrained; model lighting explains form. No modal overlays. The model's shadow is illustrative, not a physical measurement.

## Shapes

16px workbench corners, 12px grouping, 8px controls. The wood-ring mark uses nested organic rings with a single chip removed, and is shared by the header and install icons. Stage numbers represent actual sequence.

## Components

### Foundational visual states

Buttons use hover, active, disabled opacity, and visible copper focus. Selected states include aria-pressed or aria-current and a border/background. Status text reports persistence failures. WebGL failure displays recovery text and retains written lessons.

### Buttons and actions

Native buttons own all actions. Primary advances the stage; secondary toggles completion without advancement. View buttons and rotation/zoom controls provide non-drag alternatives. Future controls must reuse these styles.

### Navigation and data display

Workbench and Before you carve use the same shell and button styles. Stage selection changes exploration, never completion. No table, CRUD, date picker, or search capability is present.

### Forms and overlays

Only a native range input; platform keyboard interaction is accepted. Safety disclosure uses native details/summary. No app modal or toast system required.

### Iconography

Lucide line icons, normally 18px, always accompanied by visible text or accessible labels and native title tooltips.

### Motion

Shape interpolation explains stage differences. No automatic spinning or automatic lesson advancement. Replay is explicitly initiated and pausable; reduced motion removes transition smoothing. No motion marks a lesson complete.

### Content and data visualization

Short instructions plus a visible stopping checkpoint. Model geometry is an original simplified shape reference, not scanned carving data or a knife demonstration. Supplies and sources are linked in preparation. Never imply expert review that has not happened.

## Do's and Don'ts

- Do preserve model camera orientation between stage changes.
- Do keep completion distinct from browsing.
- Do keep every carved stage inside the previous solid.
- Don't add unexplained precise knife angles or depths.
- Don't claim device sync, physical cutting simulation, or validated instruction.

## Project library extension

The Workbench tab and logo return to a project menu. Two equal project cards show the practice egg and mushroom, using thumbnails rendered from the same geometry as the interactive models. The spoon is clearly described as a future lesson, not an enabled action. Shared Header, Workbench, usePwa, and progress utilities own recurring behavior. On phones the library is a single column. Each lesson retains its own progress and uses its own stage count.
