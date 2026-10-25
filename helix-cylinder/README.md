# Helix Cylinder — 3D scroll scene

A self-contained 3D "helix" / cylindrical card carousel driven by scroll.
Cards are arranged in a ring; an invisible scroll element converts scroll
position into rotation, and the front-most card is highlighted.

## Files

| File | Role |
|------|------|
| `CylinderScene.jsx` | Main entry. Sets up the R3F `<Canvas>`, the invisible scroll driver, the rotating cylinder group, and UI chrome (dots, arrows, section labels). |
| `CardMesh.jsx` | One card: a 3D backing plane + styled HTML overlay. Handles focus-based scale/opacity from the card's angle to front. |
| `SceneEnvironment.jsx` | Background: animated shader sphere (nebula gradient), stars, floor glow, grid lines, point lights. |
| `HeroTitle.jsx` | Big animated title that swaps with GSAP as the focused section changes. |
| `sections.js` | Data source. Each entry becomes one card. **Edit this to use your own content.** |
| `index.js` | Barrel export. |

## Dependencies

Install once in the target project:

```bash
npm install three @react-three/fiber @react-three/drei gsap
```

## Usage

```jsx
import { CylinderScene } from "./helix-cylinder";

export default function Page() {
  return <CylinderScene onSelect={(section) => console.log("opened", section)} />;
}
```

## Customizing

Edit `sections.js`. Each section needs:

- `id` — unique key
- `label` — title (card + hero)
- `subtitle` — small label under the title
- `year` — right-aligned meta text
- `index` — watermark + chip number (e.g. `"01"`)
- `gradient` — `[topColor, bottomColor]` for card background
- `accentColor` — highlight color (glow, borders, icon, CTA)
- `icon` — inline SVG string (uses `currentColor`)
- `items` — array of `{ name, tech, desc }` preview rows

## Notes

- Fonts referenced (`Playfair Display`, `Syne`, `DM Sans`) should be loaded in
  your app (e.g. via Google Fonts or `@fontsource`).
- `onSelect(section)` fires after the camera punch-in when a card is clicked —
  wire it to your detail view / route.
