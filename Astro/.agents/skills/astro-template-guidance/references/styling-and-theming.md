# Styling and Theming

The theme uses **plain CSS** exported from Webflow. There is no Tailwind. Styles are imported
by `BaseLayout.astro` in this order:

1. `src/styles/normalize.css`: reset
2. `src/styles/webflow.css`: Webflow widget base styles (sliders, tabs, navbar, forms)
3. `src/styles/theme.css`: all theme classes and **design tokens**
4. `src/styles/lenis.css`: smooth-scroll helpers
5. `src/styles/interactions.css`: inlined in `<head>`. It pre-hides elements that
   animate in (`to-top-*`, `title-animation`) until the Webflow runtime starts. Don't edit it
   by hand.

## Design tokens

At the top of `theme.css`, `:root` defines CSS custom properties. Change the tokens rather
than individual classes:

| Token | Default | Used for |
| --- | --- | --- |
| `--color--background--brand-500` | `#ea580c` | Brand orange (buttons, dots, accents) |
| `--color--primitive--brand--500` | `#b9490e` | Darker brand shade |
| `--color--background--page` | brand-50 | Page background |
| `--color--background--inverse` | `#090909` | Dark sections |
| `--color--text--secondary` … | neutrals | Text colours |
| `--_typography---typography--font-family--heading-font-family` | Overused Grotesk | Headings |
| `--_typography---typography--font-family--body-font-family` | IBM Plex Mono | Body text |
| `--_typography---type-scale--heading--h1` … `h6` | 4.5rem … 1.25rem | Type scale |
| `--_sizes---sizes--spacers--*` | 0.25rem … 7.5rem | Spacing |
| `--_sizes---sizes--radius--*` | 0.25rem … 9999px | Radii |

To rebrand, change `--color--background--brand-500` and `--color--primitive--brand--500`.
Some inline SVG icons use `#EA580C` directly (Header utility bar, home hero); search for it
to update them too.

## Fonts

- **Overused Grotesk** is self-hosted from `public/fonts/` via `@font-face` in `theme.css`.
- **IBM Plex Mono** loads from Google Fonts via the WebFont loader in `BaseLayout`.

To swap a font, change the `@font-face`/WebFont family and the matching `--…font-family` token.

## Responsive breakpoints

Webflow's breakpoints are used throughout `theme.css`: `@media screen and (max-width: 991px)`
(tablet), `767px` (mobile landscape), `479px` (mobile portrait). Utility classes like
`hide-tab` hide elements at these sizes.

## Animations

- **Webflow interactions (IX3)**: scroll reveals, hover states, navbar swap. They are
  compiled into `public/js/webflow.js` and bound to page ids and element ids. You can't edit
  them as source. Remove a `to-top-*` attribute to drop an element's reveal animation.
- **GSAP counters**: `[data-counter]` in `public/js/main.js`.
- **Lenis smooth scroll**: configured in `public/js/main.js` (`lerp`, `wheelMultiplier`).

## Dark mode

The design has no dark mode. The dark look of some sections (`section dark`, `bg-dark`
classes) is part of the design. To add a site-wide dark theme, override the colour tokens
under `@media (prefers-color-scheme: dark) { :root { … } }` in a new stylesheet imported
after `theme.css`.
