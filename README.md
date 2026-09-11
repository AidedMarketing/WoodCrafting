# WoodCrafting

A personal, mobile-first whittling workbench. The project menu offers a four-stage practice egg and a seven-stage decorative basswood mushroom.

## Run locally

Requires Node 22.12+ (or supported newer Node) and pnpm 11.

```sh
pnpm install
pnpm dev
```

## Verify and build

```sh
pnpm typecheck
pnpm test
pnpm format:check
pnpm build
pnpm preview
```

The production output is `dist/`. The production base is `/WoodCrafting/`, matching GitHub Pages. Serve that subpath over HTTPS for installability on an iPhone/iPad. In Safari choose Share → Add to Home Screen. Localhost works for desktop development; a LAN HTTP address does not enable iOS service workers.

## Included

- Orbit, zoom, labeled camera views, keyboard/button rotation, reset, and larger view.
- Project selection, independent saved progress, model-rendered thumbnails, and a wood-ring app icon.
- Consistent meshes, smooth shape transitions, pausable replay, before/after scrubbing, previous-stage wireframe, and finished-shape preview.
- Original shader-based grain, directional lighting, capped meshes, and tests for material removal, topology, winding, and final proportions.
- Beginner actions, stopping checkpoints, safety notes, equipment guidance, and source links.
- Explicit reversible completion and current-stage persistence on this device.
- Locally bundled assets, app icons, manifest, and generated content-versioned offline cache. Service worker activates only in production.
- Native controls, labeled drag alternatives, reduced transition motion, and WebGL failure recovery.

## Instruction and model limitations

This is a functional first prototype, not a validated carving course. The stage descriptions and meshes are original drafts informed by the linked sources below. A qualified carver needs to validate the full physical sequence, workholding, and hand/knife demonstrations before it is relied on as complete beginner instruction. The app states this boundary in its preparation guide.

The radial procedural meshes support the mushroom and practice egg; it is not a general model pipeline for spoons, animals, or asymmetric sculptures. The mesh interpolates shapes, not individual knife cuts. Grain is illustrative and cannot predict the grain in a user's actual block. Target blank: approximately 38 × 38 × 64 mm. Minor irregularities are welcome in the real carving.

Progress is per browser/device, with no sync or account. Clearing browser data can remove progress. GitHub Pages deployment is configured in `.github/workflows/pages.yml`. Real iPhone/iPad Safari and installed standalone mode still require hardware verification. An offline reload with the server stopped returned a blank page in the in-app browser despite worker readiness; the cause remains unresolved. See VERIFICATION.md.

## Why a mushroom first

A broad cap and sturdy stem teach corner removal, grain awareness, shallow stop cuts, and controlled shaping without adding a hollowing tool. A spoon remains a sensible second project after knife control and edge maintenance.

- [BeaverCraft beginner mushroom kit](https://beavercrafttools.com/products/diy09-family-fun-wood-carving-kit): basswood mushroom as an introductory project.
- [Flexcut selecting tools](https://www.flexcut.com/tool-tips/selecting-your-tools/): workholding, hand position behind the cutting edge, avoiding excess force.
- [BeaverCraft spoon starter set](https://beavercrafttools.com/products/s01-spoon-carving-set): straight knife plus hook knife for hollowing.

Sources checked September 11, 2026. No videos or instructional images are copied.

## Next product milestone

1. Have an experienced carver make this exact project, annotate the stage sequence, and record the essential grip/knife demonstrations.
2. Replace broad stage morphs with reviewed intermediate removal regions; author a richer per-stage model format.
3. Test side-by-side real carving on iPad and quick checks on iPhone; refine model visibility while reading.
4. Verify Safari installation/offline update behavior on real devices, then decide private hosting and optional progress sync.
5. Add a spoon with dedicated asymmetric meshes and hollowing demonstrations.

## GitHub Pages

Set repository Settings → Pages → Source to **GitHub Actions**. The Pages workflow runs on main pushes and can also be started manually. It installs locked dependencies, type-checks, tests, builds, uploads dist, and deploys. Uploading the README or unbuilt source alone does not publish the application.

Production assets, the manifest, service-worker URLs and deep links all live under `/WoodCrafting/`. `pnpm preview` prints the same subpath; development uses `/`.

`pnpm render:assets` regenerates thumbnails from the actual project geometry and renders install icons from the SVG. The generated PNGs are committed so a deployment does not need to regenerate imagery.
