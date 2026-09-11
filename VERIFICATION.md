# Verification — September 11, 2026

## Passed

- TypeScript: `pnpm typecheck`.
- Production bundle and generated offline worker: `pnpm build`.
- Formatting: `pnpm format:check`.
- Five tests: `pnpm test`. Cover monotonic material removal, valid mesh topology, outward triangle winding, final mushroom proportions, and worker caching/offline navigation/cache version isolation.
- Premium static audit: zero findings, strict mode.
- Eight DESIGN.md color tokens match the canonical CSS variables.
- Browser checks in the Codex in-app browser: stage navigation, finished preview, replay, previous-stage wireframe, keyboard range adjustment, view controls, completion toggling, persisted completion after reload, preparation navigation, and mobile layout without horizontal overflow.
- Inspected 390 × 844 phone and 1180 × 900 / 1024 × 820 tablet/desktop layouts.
- Production worker reaches ready state. No new production console errors observed; earlier development Fast Refresh root warnings were addressed by separating App from the entry point.

## Unresolved / not claimed

- With the local server stopped, in-app browser reload returned a blank page despite worker readiness. The cause is not established; do not claim offline relaunch is verified. Worker logic passes a mocked offline test, which is not a substitute for a real browser/hardware check.
- Real iPhone and iPad Safari, installed standalone mode, multitouch gestures, reduced-motion OS mode, WebGL loss recovery, storage rejection, and full accessibility conformance have not been tested on devices.
- The instruction sequence needs experienced-carver review and real hand/knife demonstrations. Current animation is only a shape reference.
- No public or private hosted deployment was created; localhost is the available preview.

## Project menu and GitHub Pages revision

- Production paths now use `/WoodCrafting/` for entry assets, app icon, project thumbnails, service worker, and manifest scope. Development retains `/`.
- Nine tests pass, including both root/subdirectory offline workers and independent, sanitized egg/mushroom progress.
- Browser inspection at 1180 × 900 and 390 × 844 confirms loaded project images and no horizontal overflow. Both projects open; stage counts match their lessons. Completing the egg does not complete a mushroom step.
- Mushroom shape inspected in 3D: smoother dome and stem, subdued grain, consistent geometry across stages. Menu images are generated from the same meshes.
- Strict UI audit has zero findings. Production build and TypeScript checks pass.
- Real installed Safari offline relaunch and actual carving technique remain unverified; the prior offline-reload limitation is retained above.
