# WoodCrafting behavior contract

Source: user brief in this task, 2026-09-11. One private personal PWA for first-time whittling, guided prepared shapes, no virtual cutting.

## Canonical UI Map

| Capability      | Canonical owner                       | Source of truth      | Allowed variants                     | Verification                     |
| --------------- | ------------------------------------- | -------------------- | ------------------------------------ | -------------------------------- |
| Scrollbar       | src/style.css                         | DESIGN.md            | global, system forced-colors         | browser inspection               |
| Stage selection | Workbench select in src/Workbench.tsx | user brief           | sequential or direct                 | browser stage/replay workflow    |
| Progress        | progress.js + Workbench               | device-local storage | explicit completion, undo completion | browser reload                   |
| Model controls  | Viewer.tsx and native buttons         | user brief           | drag/pinch or button controls        | browser views and geometry tests |

## State rules

- Stage selection stops replay, exits finished preview, and displays the selected after-state. Camera stays unchanged.
- Previewing a finished project does not change stage or completion.
- Mark complete is reversible. It never moves to another stage.
- Device-local progress persists only stage and unique completed stage IDs. Invalid storage resets safely. Storage failure stays visible.
- The application opens on the project library unless an explicit `?project=egg` or `?project=mushroom` deep link is supplied. Workbench and the logo always return to the library.
- Progress is isolated by stable project ID, and existing mushroom progress is preserved.
- Before you carve preserves lesson selection on return. No remote account, analytics, uploads, or sync.
- Offline production shell is precached by a content-versioned service worker. New workers wait for old clients to close. No credentials or personal data in caches.
- WebGL failure retains written content and exposes reload recovery.
- Focus is never trapped in the canvas. Buttons provide camera controls.

## Scope

No money, permissions, deletion, legal acceptance, or account lifecycle. The lesson is an original instructional draft pending experienced-carver review. It is not a complete hand-placement training course.

## Deployment

The user selected GitHub Pages at /WoodCrafting/. Vite production base, manifest relative paths, service-worker scope/cache, thumbnails, and links must respect that prefix. A main-branch Actions workflow builds dist and publishes it. Pages must use GitHub Actions as the publishing source. The service worker cache namespace includes its scope so one app never clears another app's caches.
