# Deferred components

These components were built during an earlier iteration but are not part of
the v1 site. They live here so they're easy to pull back in for v2, but they
are **not compiled into the production bundle** (TypeScript doesn't see them
because `tsconfig.app.json` only includes `src/`, and `App.tsx` doesn't
import them).

| File | What it does | When to revive |
|---|---|---|
| `Technology.tsx` | Full technical deep-dive section with governing equations | When adding a dedicated `/technology` page |
| `UseCases.tsx` | Industry-specific application cards | When we have real customer stories to back each card |
| `Comparison.tsx` | Side-by-side competitor comparison table | When we have benchmarks to cite |
| `Demo.tsx` | Placeholder for embedded simulation videos | When we have real PulseSuite output recordings |
| `PulseDesigner.tsx` | 2D interactive pulse shaper | As a documentation widget, not homepage filler |
| `PulseDesigner3D.tsx` | WebGL 3D pulse visualizer (Three.js) | Same — doc demo, not marketing |
| `SBEVisualizer3D.tsx` | WebGL 3D carrier-dynamics visualizer (Three.js) | Same |

**Note:** `PulseDesigner3D.tsx` and `SBEVisualizer3D.tsx` depend on `three`,
which has been removed from `package.json`. To revive them you'll need to
run `pnpm add three @types/three`.
