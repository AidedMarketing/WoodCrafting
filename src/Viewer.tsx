import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { stagePositions, stageIndices } from "./geometry.js";

type Props = {
  project?: "mushroom" | "egg";
  stage: number;
  blend: number;
  ghost: boolean;
  view: string;
  zoom: number;
  rotation: number;
  reset: number;
};
export function Viewer(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ update: (p: Props) => void } | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(4, 2.5, 7);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 4.5;
    controls.maxDistance = 13;
    controls.target.set(0, 0, 0);
    controls.update();
    controls.saveState();
    scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x807263, 2.1));
    const light = new THREE.DirectionalLight(0xffeed9, 2.5);
    light.position.set(-3, 6, 4);
    scene.add(light);
    const rim = new THREE.DirectionalLight(0xffffff, 1.5);
    rim.position.set(4, 2, -4);
    scene.add(rim);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(stagePositions(props.stage, props.project), 3),
    );
    geometry.setIndex(stageIndices());
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0xc5a47b,
      roughness: 0.86,
      flatShading: false,
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = "varying vec3 vWood;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvWood = position;",
      );
      shader.fragmentShader = "varying vec3 vWood;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
    float rings = length(vec2(vWood.x*.85+.4,vWood.z+.7));
    float wandering = sin(vWood.y*1.1 + vWood.x*3.0)*.025;
    float grain = sin((rings+wandering)*100.0);
    float fine = sin((rings+wandering*.8)*310.0);
    diffuseColor.rgb *= 0.98 + .024*grain + .012*fine;`,
      );
    };
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    const oldGeo = geometry.clone();
    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0x277579,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
    });
    const previous = new THREE.Mesh(oldGeo, ghostMat);
    scene.add(previous);
    const guideGeo = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 65 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(a) * 1.007,
          0.55,
          Math.sin(a) * 1.007,
        );
      }),
    );
    const guide = new THREE.Line(
      guideGeo,
      new THREE.LineDashedMaterial({
        color: 0x304a48,
        dashSize: 0.05,
        gapSize: 0.035,
      }),
    );
    guide.computeLineDistances();
    scene.add(guide);
    let target = stagePositions(props.stage, props.project),
      frame = 0,
      last: Props | undefined;
    api.current = {
      update(p) {
        if (
          !last ||
          p.stage !== last.stage ||
          p.blend !== last.blend ||
          p.project !== last.project
        ) {
          const before = stagePositions(Math.max(0, p.stage - 1), p.project),
            after = stagePositions(p.stage, p.project);
          target = new Float32Array(after.length);
          for (let i = 0; i < after.length; i++)
            target[i] = before[i] + (after[i] - before[i]) * p.blend;
          oldGeo.setAttribute("position", new THREE.BufferAttribute(before, 3));
        }
        previous.visible = p.ghost && p.stage > 0;
        guide.visible = p.project !== "egg" && (p.stage === 2 || p.stage === 3);
        if (!last || p.view !== last.view || p.reset !== last.reset) {
          const d = 8.4;
          if (p.view === "Top") camera.position.set(0, d, 0.001);
          else if (p.view === "Front") camera.position.set(0, 0, d);
          else if (p.view === "Under") camera.position.set(0, -d, 0.001);
          else camera.position.set(4, 2.5, 7);
          controls.target.set(0, 0, 0);
          controls.update();
        }
        if (last && p.zoom !== last.zoom) {
          camera.position
            .sub(controls.target)
            .multiplyScalar(p.zoom > last.zoom ? 0.85 : 1.18)
            .clampLength(4.5, 13)
            .add(controls.target);
          controls.update();
        }
        if (last && p.rotation !== last.rotation) {
          const v = camera.position.clone().sub(controls.target);
          v.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            ((p.rotation - last.rotation) * Math.PI) / 6,
          );
          camera.position.copy(v.add(controls.target));
          controls.update();
        }
        last = p;
      },
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = new ResizeObserver(() => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resize.observe(el);
    function draw() {
      frame = requestAnimationFrame(draw);
      if (document.hidden) return;
      const pos = geometry.getAttribute("position");
      let changed = false;
      for (let i = 0; i < target.length; i++) {
        const delta = target[i] - pos.array[i];
        if (Math.abs(delta) > 0.00001) {
          pos.array[i] += reduce.matches ? delta : delta * 0.18;
          changed = true;
        }
      }
      if (changed) {
        pos.needsUpdate = true;
        geometry.computeVertexNormals();
      }
      controls.update();
      renderer.render(scene, camera);
    }
    draw();
    const lost = (e: Event) => {
      e.preventDefault();
      setError(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    api.current.update(props);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      geometry.dispose();
      oldGeo.dispose();
      material.dispose();
      ghostMat.dispose();
      guideGeo.dispose();
      (guide.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
  }, []);
  useEffect(() => api.current?.update(props), [props]);
  return (
    <>
      <div
        ref={host}
        className="canvas"
        role="img"
        aria-label={`Interactive wood model, stage ${props.stage + 1}. Use the labeled view, rotation and zoom buttons as an alternative to dragging.`}
      />
      {error && (
        <div className="viewer-error">
          <strong>3D is unavailable on this browser.</strong>
          <p>
            Your written lesson still works. Reload in a WebGL-enabled browser
            to restore the model.
          </p>
          <button onClick={() => location.reload()}>Reload model</button>
        </div>
      )}
    </>
  );
}
