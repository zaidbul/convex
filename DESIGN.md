# Design System Strategy: The Sovereign Ledger

## 1. Overview & Creative North Star

**Creative North Star: The Sovereign Ledger**
This design system is not a utility; it is an editorial statement of power and clarity. Moving beyond the "app-like" fatigue of the current fintech landscape, we lean into **High-Contrast Editorialism**. The goal is to make the user feel like they are interacting with a premium, bespoke publication that just happens to be a financial tool.

We break the "template" look by utilizing intentional asymmetry, drastic shifts in typography scale, and "Blackspace"—a concept where the dark void of the background is not empty, but a canvas for high-intensity focal points. We ignore traditional grid-bound containment in favor of overlapping elements and vast, breathing compositions that guide the eye with surgical precision.

---

## 2. Colors

The color philosophy is rooted in extreme contrast. We use a palette that evokes the deep glow of a trading terminal fused with the crispness of high-end fashion typography.

### Core Palette
- **Primary (The Signature Glow):** `primary` (#fd5300) and `primary_container` (#d54600). This is the heartbeat of the system. It should be used sparingly but with high impact to denote action and success.
- **Surface (The Deep Void):** `surface` (#16130d) and `surface_container_lowest` (#110e08). These are the foundations of the "Blackspace."
- **On-Surface (The Pristine):** `secondary` (#ffffff) and `on_surface` (#eae1d6). Used for maximum legibility against the dark background.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or containment. Structural boundaries must be defined solely through background color shifts. For example, a `surface_container_low` section sitting on a `surface` background creates a sophisticated, "frameless" transition that feels more integrated and premium than a hard-coded line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, dark paper.
1. **Level 0 (Base):** `surface` or `surface_container_lowest`.
2. **Level 1 (Sectioning):** `surface_container_low` or `surface_container`.
3. **Level 2 (Interaction/Cards):** `surface_container_high` or `highest`.

### The "Glass & Gradient" Rule
To add "soul" to the layout, use Glassmorphism for floating elements (using semi-transparent surface colors with a `backdrop-blur` of 20px-40px). For primary CTAs, apply a subtle linear gradient from `primary` (#fd5300) to `primary_container` (#d54600) at a 135-degree angle to provide a professional, three-dimensional polish that flat hex codes cannot achieve.

---

## 3. Typography

The typography is the voice of the system: authoritative yet accessible.

- **Display & Headlines (Plus Jakarta Sans):** These are the "Editorial" moments. Use `display-lg` (3.5rem) with tight tracking (-0.02em) to create a sense of scale. The bold, geometric nature of this typeface conveys modernity and confidence.
- **Body & Labels (Inter):** For data and long-form text, Inter provides unparalleled legibility. `body-md` (0.875rem) is the workhorse for information density.
- **The Editorial Accent:** While not in the primary tokens, use a high-contrast serif (like Martina Plantijn) for 1% of the experience—specifically for pull-quotes or secondary descriptors—to provide that high-end, "signature" feel.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than traditional drop shadows.

### The Layering Principle
Depth is achieved by "stacking" the surface-container tiers. Place a `surface_container_lowest` card on a `surface_container_low` section to create a soft, natural "lift." This mimics the way light interacts with high-quality materials.

### Ambient Shadows
When an element must "float" (e.g., a modal or a floating action button), shadows must be extra-diffused.
- **Blur:** 30px–60px.
- **Opacity:** 4%–8%.
- **Color:** Use a tinted version of `on_surface` (a very dark, warm grey) to mimic natural ambient light rather than a synthetic "drop shadow."

### The "Ghost Border" Fallback
If a border is required for accessibility, use a **Ghost Border**: the `outline_variant` token at 15% opacity. 100% opaque, high-contrast borders are strictly forbidden as they clutter the "Blackspace."

---

## 5. Components

### Buttons
- **Primary:** `primary_container` (#d54600) background with `on_primary_fixed` (#220a00) text. Use `rounded-full` (9999px) for a sleek, organic feel.
- **Secondary:** `secondary` (#c25730) background with `surface` (#16130d) text. High contrast for high importance.
- **Tertiary:** No background. Text-only using `primary` (#fd5300) with an underline that appears only on hover.

### Cards & Data Modules
**Rule:** Forbid the use of divider lines.
- Use the **Spacing Scale** (specifically `spacing-6` or `spacing-8`) to create separation.
- Cards should utilize `surface_container_high` to sit subtly above the base background.
- Apply `rounded-md` (1.5rem) to all container corners to maintain a sophisticated softness.

### Chips
- **Selection Chips:** Use `secondary_container` (#f9a785) for active states to create a vibrant, lime-green highlight that contrasts with the primary brand green.
- **Filter Chips:** `surface_container_highest` with `on_surface` text for a subtle, integrated look.

### Input Fields
- Avoid "box" inputs. Use a `surface_container_low` background with a `rounded-sm` (0.5rem) corner.
- The active state should not be a border change, but a subtle glow—using a 1px `primary` shadow with high blur (10px).

---

## 6. Do's and Don'ts

### Do
- **Do** lean into asymmetrical layouts. Offset text blocks from images to create visual tension and interest.
- **Do** use `primary` (#fd5300) for data visualizations (charts, graphs) to signify growth and positive movement.
- **Do** utilize "Blackspace." Give elements room to breathe—use `spacing-20` (7rem) for section margins to create an elite, unhurried atmosphere.

### Don't
- **Don't** use pure grey. Always use the warm, "earthy" darks provided in the `surface` tokens (#16130d) to keep the dark mode feeling premium rather than "default."
- **Don't** use 1px dividers between list items. Use vertical whitespace (`spacing-3`) or subtle background alternating shifts.
- **Don't** use generic iconography. Icons must be ultra-minimalist, thin-stroke (1.5px), and use the `on_surface_variant` color to avoid competing with text.
- **Don't** crowd the interface. If a screen feels "busy," remove an element rather than shrinking it.