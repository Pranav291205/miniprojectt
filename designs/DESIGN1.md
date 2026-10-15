---
name: Synthetic Telemetry & Geospatial Intelligence
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#1bbd85'
  on-tertiary-container: '#00452e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.03em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-density, mission-critical interface standard engineered for metropolitan transport command centers, logistics dispatchers, and autonomous fleet routing engines. The visual tone bridges enterprise infrastructure software with advanced spatial intelligence tools, projecting decisive authority, real-time fidelity, and cognitive clarity under 24/7 operating conditions.

The visual style employs an **Instrument-Grade Dark UI** strategy:
- **Foundational Surfaces:** Monolithic, low-reflectance midnight and deep slate planes eliminate visual fatigue while delivering maximum chromatic contrast for spatial overlays and dynamic vector polylines.
- **Data-First Luminescence:** Color is deployed strictly as semantic signal. Vector telemetry glows against dark surfaces, reserving high-saturation wavelengths exclusively for predictive anomalies, congestion gradients, and routing interventions.
- **Tactile Precision:** Fine structural borders, restrained surface-container tiers, and calibrated glassmorphism allow map substrates to bleed subtly through analytical floating heads-up display (HUD) cards without sacrificing legible data separation.
- **Operational Density:** Balanced information density supports rapid scan-and-act cycles, utilizing compact metric clusters, tabular numerical stability, and modular dockable command arrays.

## Colors

The color architecture is built around calibrated contrast levels against a deep, non-pure-black floor (`#0B0F17`), ensuring sustained viewing comfort while meeting rigorous WCAG AAA legibility targets for critical alerts.

### Surface and Ground Tiers
- **Canvas Base (`#0B0F17`):** Base map underlay and primary system backdrop.
- **Surface Level 1 (`#111827`):** Canvas containers, major application shells, and permanent sidebar docks.
- **Surface Level 2 (`#1A2234`):** Collapsible panels, analytical dashboards, card backgrounds, and drawer surfaces.
- **Surface Level 3 / HUD Overlay (`#1E293B`):** Floating controls, modal surfaces, tooltips, and interactive popovers.
- **Border Trim:** Defined by structural strokes using `rgba(255, 255, 255, 0.08)` for dormant separations and `#334155` for panel framing.

### Operational Accents
- **Primary Telemetry (`#06B6D4` / `#3B82F6`):** Electric Cyan and Precision Blue dictate active telemetry points, operational route polylines, primary action drivers, and focused states.
- **Machine Intelligence & Inference (`#8B5CF6` / `#A855F7`):** Deep and radiant violet marks multi-horizon ML confidence bands, predictive counterfactual paths, model explanations, and automated route recommendations.

### Semantic Telemetry Scale (Congestion Dynamics)
- **Free Flow / Optimal (`#10B981`):** High-efficiency velocity corridors and nominal capacity.
- **Impeded / Modulating (`#F59E0B`):** Emerging speed degradation and cautionary density spikes.
- **Congested / Constrained (`#F97316`):** Critical capacity bottlenecking with queue formation.
- **Severe Gridlock / Incident (`#EF4444`):** Total throughput collapse, localized collisions, or physical roadway closures.

## Typography

The typography pairs a clean grotesque grotesque sans-serif with an uncompromising, developer-grade monospaced face. 

- **Primary Interface Face (Inter):** Deployed across all structural navigation, structural headings, narrative reporting, and interactive form elements. It provides uniform optical balance, precise legibility at micro-sizes, and wide multilingual character support.
- **Telemetry and Technical Data Face (JetBrains Mono):** Mandated for all numerical data values, GPS coordinates, timestamps, speed indicators (e.g., `km/h`, `mph`), latency figures, delta values, and algorithm certainty percentages.
- **Tabular Figures Constraint:** All numerical readouts rendered in Inter must apply the OpenType feature `tnum` (tabular numbers) to avoid horizontal layout jitter during real-time stream updates.
- **Case Rules:** All micro-labels, coordinate stamps, and system statuses styled with `label-sm` or `label-md` must use strict uppercase styling paired with expanded letter-spacing to enhance legibility across dark viewports.

## Layout & Spacing

The layout model is driven by an interactive geospatial viewport overlaid with dynamic modular panels. It accommodates dense analytical dashboards alongside full-canvas operational maps.

### Spatial Grid Architecture
- **Desktop (1440px and up):** 12-column variable fluid grid framed by `gutter-desktop` (24px) and outer structural margin `margin-desktop` (32px). Floating panels dock to an interior 8px coordinate grid.
- **Tablet / Operational Console (768px – 1439px):** 8-column layout with 16px gutters and margins; sidebars collapse into persistent fly-out utility trays to preserve map viewport fidelity.
- **Mobile Handheld (Below 768px):** 4-column responsive stack; persistent telemetry panels transform into bottom-anchored sheets with predefined snap heights (25%, 50%, 90% view height).

### Overlay Density Rules
- Geospatial surfaces are zero-padded to allow full-bleed tile rendering.
- Floating HUD cards, floating utility bars, and route inspector toolbars float with a uniform gap of `space-md` (12px) from view edges.
- Metric grids inside operational cards use compact `space-xs` (4px) and `space-sm` (8px) internal distributions to eliminate whitespace waste while preserving visual hierarchy.

## Elevation & Depth

Visual hierarchy within this design system uses tonal layering paired with controlled structural edge highlights, avoiding heavy diffuse shadows that muddy dark themes.

- **Level 0 (Map / Raw Canvas):** Base elevation layer (`#0B0F17`) with zero shadow and no blur.
- **Level 1 (Docked Structural Rail & Shells):** Background tone of `#111827`, accented with a crisp 1px right/top border using `rgba(255, 255, 255, 0.08)`. No cast shadow.
- **Level 2 (In-Viewport HUD Cards & Floating Monitors):** Surface tone `#1A2234` rendered at 85% opacity with an active `backdrop-filter: blur(12px)`. Outlined with a 1px solid stroke in `#334155`. Casts an ambient, low-spread dark shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`.
- **Level 3 (Interactive Modals, Flyouts & Dynamic Tooltips):** Surface tone `#1E293B` at 95% opacity with `backdrop-filter: blur(16px)`. Border uses `#06B6D4` at 30% opacity on active inspection, or `#334155` when dormant. Cast shadow: `0 16px 36px -6px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)`.
- **Active Telemetry Glow:** Active polylines, pinpoint radars, and selected incident markers cast localized atmospheric glows utilizing their direct semantic color (e.g., `0 0 12px rgba(6, 182, 212, 0.45)` for selected primary routes).

## Shapes

The shape system leverages crisp, functional geometry with controlled soft corners (`roundedness: 1`), conveying engineering rigor without the visual severity of razor-sharp angles.

- **Base Components (Inputs, Chips, Buttons):** Standard radius of `0.25rem` (4px). Preserves compact structural integrity and visual alignment in data-heavy rows.
- **Panels, Cards & Viewport HUD Containers:** Defined by `rounded-lg` at `0.5rem` (8px). Softens floating module boundaries against underlying geographic curves.
- **Dialogs & Large Floating Modals:** Defined by `rounded-xl` at `0.75rem` (12px) to clearly isolate focused operational states.
- **Polylines, Nodes & Map Vectors:** Nodes maintain exact circular geometry (`50%` or 9999px) to communicate directional coordinates, while path vector joins use round capping to prevent visual artifacting across varying intersection angles.

## Components

### Buttons & Trigger Systems
- **Primary Action (Dispatch / Execute Route):** Solid `#06B6D4` fill with `#0B0F17` text set in Inter SemiBold. On hover, background shifts to `#22D3EE` with a subtle cyan glow.
- **Secondary / Operational:** Outlined 1px `#334155` on `#1E293B` surface with `#F8FAFC` text. Hover shifts border to `#06B6D4` at 50% opacity.
- **Ghost / Map Toolbar Utility:** Transparent background, text/icon `#94A3B8`. Hover introduces `#1E293B` fill with `#FFFFFF` iconography.

### Chips & Semantic Status Indicators
- **Incident & Congestion Chips:** Compact height (22px), `0.25rem` radius, JetBrains Mono text (`label-sm`). Built with a 10% opacity semantic background, matching 1px border at 40% opacity, and full-intensity foreground text.
- **Telemetry Live Badges:** Preceded by a 6px circular pulsing indicator displaying semantic congestion or real-time connection status.

### Form Inputs & Search Arrays
- **Geospatial / Coordinate Search Input:** `#111827` background, 1px `#334155` border, inset horizontal padding of `space-md`. JetBrains Mono placeholder text in `#64748B`. Focused state introduces a `#06B6D4` 1px border and a low-spread focus ring (`0 0 0 2px rgba(6, 182, 212, 0.2)`).

### Cards & Analytical HUD Modules
- **Modular HUD Card:** Composed of a distinct header bar (12px padding, bottom border `rgba(255,255,255,0.06)`), metric display payload, and optional technical footer. All numbers render via `JetBrains Mono` with unit suffixes in smaller label sizing (`label-sm`).
- **Route Comparison Diff Card:** Displays side-by-side or stacked travel-time deltas, distance variations, and ML confidence levels. Metric variance indicators leverage positive (Emerald `#10B981`) or negative (Crimson `#EF4444`) pill badges.

### Specialized Geospatial & Telemetry Controls
- **Floating Map Toolbar:** Vertical or horizontal grouping of 36x36px icon buttons enclosed in a single HUD panel (`#1A2234` with backdrop blur), separated by 1px dividers (`rgba(255,255,255,0.08)`).
- **Temporal Scrubber / Timeline Slider:** High-precision timeline track (`#334155`, 4px height) with future predictive horizon rendered in dashed Purple (`#8B5CF6`). Scrubber handle features a glowing Cyan pin displaying current dynamic timestamp in monospaced typography above the thumb.
- **Confidence Interval Bands:** Dual-line multi-horizon graphs plotting predictive variance over time; the area between boundaries uses violet shading with 12% opacity (`rgba(139, 92, 246, 0.12)`).