import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  Play,
  Pause,
  Layers,
  BookOpen,
  ShieldCheck,
  Package,
  Compass,
  Maximize2,
  WifiOff,
} from "lucide-react";
import { Viewer } from "./Viewer";
import { supplies, sources } from "./lesson";
import { Header } from "./Header";
import { projects, type ProjectId } from "./projects";
import { readProgress, progressKey } from "./progress.js";
export default function Workbench({
  projectId,
  onMenu,
  initialPage = "workbench",
  status,
}: {
  projectId: ProjectId;
  onMenu: () => void;
  initialPage?: string;
  status: string;
}) {
  const project = projects[projectId];
  const stages = project.stages;
  const lastStage = stages.length - 1;
  const KEY = progressKey(projectId);
  const [saved] = useState(() =>
    readProgress(localStorage, projectId, stages.length),
  );
  const [stage, setStage] = useState(saved.stage);
  const [done, setDone] = useState<number[]>(saved.done);
  const [page, setPage] = useState(initialPage);
  const [blend, setBlend] = useState(1);
  const [ghost, setGhost] = useState(false);
  const [view, setView] = useState("Perspective");
  const [zoom, setZoom] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [reset, setReset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [focus, setFocus] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [preview, setPreview] = useState(false);
  const animation = useRef(0);
  const lesson = stages[stage];
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ stage, done }));
    } catch {
      setStorageError(true);
    }
  }, [stage, done]);
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / 3500, 1);
      setBlend(t);
      if (t < 1) animation.current = requestAnimationFrame(tick);
      else setPlaying(false);
    }
    animation.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation.current);
  }, [playing]);
  function select(i: number) {
    setPlaying(false);
    setPreview(false);
    setStage(i);
    setBlend(1);
    document
      .querySelector(".model-panel")
      ?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  function replay() {
    setPreview(false);
    setBlend(0);
    setPlaying(true);
  }
  const completion = done.length;
  return (
    <div className={focus ? "app focused" : "app"}>
      <Header
        prepare={page === "prepare"}
        onMenu={onMenu}
        onPrepare={() => setPage("prepare")}
        status={status}
      />
      <main>
        <button className="back-library" onClick={onMenu}>
          <ArrowLeft size={16} /> All projects
        </button>
        <div className="page-heading">
          <div>
            <p className="eyebrow">{project.tag}</p>
            <h1>
              {project.title}
              <span>.</span>
            </h1>
            <p className="subtitle">
              Learn the cuts. Read the grain. Make something with your hands.
            </p>
          </div>
          <div className="project-meta">
            <span>BASSWOOD</span>
            <strong>1 knife. {stages.length} stages.</strong>
            <small>Take your time. There’s no timer.</small>
          </div>
        </div>
        {page === "workbench" ? (
          <>
            <div className="workbench">
              <section
                className="model-panel"
                aria-label="Interactive carving model"
              >
                <div className="model-top">
                  <span className="small-label">
                    {preview
                      ? "FINISHED SHAPE"
                      : `STAGE ${String(stage + 1).padStart(2, "0")} / ${String(stages.length).padStart(2, "0")}`}
                  </span>
                  <button
                    className="text-button"
                    onClick={() => {
                      setPlaying(false);
                      setPreview(!preview);
                      setBlend(1);
                    }}
                  >
                    {preview ? "Return to my stage" : "See finished shape"}{" "}
                    <ArrowRight size={15} />
                  </button>
                </div>
                <div className="model-space">
                  <Viewer
                    project={projectId}
                    stage={preview ? lastStage : stage}
                    blend={blend}
                    ghost={ghost && !preview}
                    view={view}
                    zoom={zoom}
                    rotation={rotation}
                    reset={reset}
                  />
                  <div className="model-dimension">
                    <span>{project.dimension}</span>
                    <i />
                  </div>
                  <div className="view-tools">
                    <button
                      title="Zoom in"
                      aria-label="Zoom in"
                      onClick={() => setZoom(zoom + 1)}
                    >
                      <Plus />
                    </button>
                    <button
                      title="Zoom out"
                      aria-label="Zoom out"
                      onClick={() => setZoom(zoom - 1)}
                    >
                      <Minus />
                    </button>
                    <span />
                    <button
                      title="Rotate left"
                      aria-label="Rotate left"
                      onClick={() => setRotation(rotation - 1)}
                    >
                      <RotateCcw />
                    </button>
                    <button
                      title="Rotate right"
                      aria-label="Rotate right"
                      onClick={() => setRotation(rotation + 1)}
                    >
                      <RotateCw />
                    </button>
                    <button
                      title="Reset view"
                      aria-label="Reset view"
                      onClick={() => {
                        setView("Perspective");
                        setReset(reset + 1);
                      }}
                    >
                      <Compass />
                    </button>
                    <button
                      title={focus ? "Exit larger view" : "Larger view"}
                      aria-label={focus ? "Exit larger view" : "Larger view"}
                      aria-pressed={focus}
                      onClick={() => setFocus(!focus)}
                    >
                      <Maximize2 />
                    </button>
                  </div>
                  <div className="model-caption">
                    <span className="model-dot" />
                    {preview ? stages[lastStage].look : lesson.look}
                  </div>
                </div>
                <div className="view-row">
                  <div className="view-switch" aria-label="Model views">
                    {["Perspective", "Front", "Top", "Under"].map((v) => (
                      <button
                        key={v}
                        aria-pressed={view === v}
                        onClick={() => {
                          setView(v);
                          setReset(reset + 1);
                        }}
                      >
                        {v === "Perspective" ? "3D" : v}
                      </button>
                    ))}
                  </div>
                  <span className="gesture-hint">
                    Drag to rotate · pinch to zoom
                  </span>
                </div>
                <div className="animation-bar">
                  <button
                    className="play-button"
                    disabled={stage === 0 || preview}
                    aria-label={playing ? "Pause change" : "Replay change"}
                    onClick={() => (playing ? setPlaying(false) : replay())}
                  >
                    {playing ? <Pause size={19} /> : <Play size={19} />}
                  </button>
                  <div className="scrubber">
                    <label htmlFor="change">
                      {stage === 0
                        ? "Your starting shape"
                        : playing
                          ? "Watching the shape change"
                          : "Explore this shape change"}
                    </label>
                    <input
                      id="change"
                      aria-label="Shape change from before to after"
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={Math.round(blend * 100)}
                      disabled={stage === 0 || preview}
                      onChange={(e) => {
                        setPlaying(false);
                        setBlend(Number(e.target.value) / 100);
                      }}
                    />
                    <div>
                      <span>Before</span>
                      <span>After</span>
                    </div>
                  </div>
                  <button
                    className={ghost ? "ghost-button active" : "ghost-button"}
                    aria-pressed={ghost}
                    disabled={stage === 0 || preview}
                    onClick={() => setGhost(!ghost)}
                  >
                    <Layers size={18} />
                    <span>
                      Previous
                      <br />
                      outline
                    </span>
                  </button>
                </div>
                <p className="model-note">
                  Shape demonstration · simplified stages, not a knife-motion
                  simulation
                </p>
              </section>
              <section className="instruction" aria-labelledby="step-title">
                <div className="instruction-kicker">
                  <span>STEP {String(stage + 1).padStart(2, "0")}</span>
                  <span>{lesson.skill}</span>
                </div>
                <h2 id="step-title">{lesson.title}</h2>
                <p className="lead">{lesson.summary}</p>
                <div className="instruction-body">
                  <p>{lesson.action}</p>
                  <ol>
                    {lesson.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ol>
                  <div className="checkpoint">
                    <div>
                      <Check size={17} />
                      <strong>Ready when</strong>
                    </div>
                    <p>{lesson.check}</p>
                  </div>
                  <details className="safety" open>
                    <summary>
                      <ShieldCheck size={18} />A safe next cut
                      <ChevronDown size={16} />
                    </summary>
                    <p>{lesson.safety}</p>
                  </details>
                </div>
                <div className="step-actions">
                  <button
                    className={
                      done.includes(stage)
                        ? "complete-button completed"
                        : "complete-button"
                    }
                    aria-pressed={done.includes(stage)}
                    onClick={() =>
                      setDone(
                        done.includes(stage)
                          ? done.filter((x) => x !== stage)
                          : [...done, stage],
                      )
                    }
                  >
                    {done.includes(stage) ? (
                      <Check size={18} />
                    ) : (
                      <span className="empty-check" />
                    )}
                    {done.includes(stage)
                      ? "Step complete"
                      : "Mark step complete"}
                  </button>
                  <div className="step-pagination">
                    <button
                      aria-label="Previous step"
                      disabled={stage === 0}
                      onClick={() => select(stage - 1)}
                    >
                      <ArrowLeft size={19} />
                    </button>
                    <button
                      className="next-button"
                      disabled={stage === lastStage}
                      onClick={() => select(stage + 1)}
                    >
                      Next step <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </section>
            </div>
            <section className="journey" aria-label="Carving stages">
              <div className="journey-heading">
                <h3>The path from block to {project.name}</h3>
                <span>
                  {completion} of {stages.length} complete
                </span>
              </div>
              <div
                className="stage-list"
                style={{
                  gridTemplateColumns: `repeat(${stages.length},minmax(0,1fr))`,
                }}
              >
                {stages.map((s, i) => (
                  <button
                    key={s.title}
                    className={`stage-card ${stage === i ? "current" : ""}`}
                    aria-current={stage === i ? "step" : undefined}
                    onClick={() => select(i)}
                  >
                    <span className="stage-number">
                      {done.includes(i) ? (
                        <Check size={17} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <span>{s.short}</span>
                    <span className="stage-rule" />
                  </button>
                ))}
              </div>
            </section>
            {completion === stages.length && (
              <div className="finished-message" role="status">
                <Check />
                <div>
                  <strong>You made your {project.name}.</strong>
                  <p>
                    Keep it. Your next one will show you how much you’ve
                    learned. Revisit any stage whenever you like.
                  </p>
                </div>
              </div>
            )}
            <div className="bench-footer">
              <p>
                <ShieldCheck size={17} />
                Knife down before screen time.
              </p>
              <button
                className="text-button"
                onClick={() => setPage("prepare")}
              >
                Your tools & first-cut guide <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <section className="preparation">
            <div className="prep-intro">
              <p className="eyebrow">A LITTLE PREPARATION</p>
              <h2>Start with a good setup.</h2>
              <p>
                You only need a small kit. Get comfortable with a few practice
                shavings before shaping your {project.name}.
              </p>
              <button className="primary" onClick={() => setPage("workbench")}>
                Return to the model <ArrowRight size={18} />
              </button>
            </div>
            <div className="prep-content">
              <h3>
                <Package size={20} /> Your first kit
              </h3>
              {supplies.map(([title, desc]) => (
                <article className="supply" key={title}>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </article>
              ))}
              <h3>
                <ShieldCheck size={20} /> Before the first cut
              </h3>
              <ol className="prep-steps">
                <li>
                  Use a stable work surface and secure the wood. Keep both hands
                  behind the cutting edge, with no body part in the path of a
                  slip.
                </li>
                <li>
                  On scrap, make a tiny shaving away from yourself. If fibers
                  lift or split ahead of the edge, stop and reverse the work’s
                  orientation.
                </li>
                <li>
                  Practice shallow stop cuts and small chips into them. Do not
                  pry. If a cut needs force, stop and check the wood, cut size,
                  and edge.
                </li>
                <li>
                  Pause when tired. Sheathe the blade before checking your
                  device, getting up, or clearing shavings.
                </li>
              </ol>
              <div className="checkpoint">
                <strong>Learn the grip with a person, too.</strong>
                <p>
                  This first model teaches shape progression. It does not show
                  hand placement, blade angle, or safe workholding for every
                  cut. Before using a knife, learn those from a qualified
                  instructor or the tool maker’s demonstration.
                </p>
              </div>
              <h3>
                <BookOpen size={20} /> Lesson references
              </h3>
              <p>
                The sequence and 3D shapes are original teaching drafts,
                informed by these sources. They still need a hands-on carving
                review.
              </p>
              {sources.map((s) => (
                <a
                  className="source"
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{s.title} ↗</strong>
                  <span>{s.note}</span>
                </a>
              ))}
              <h3>On your iPhone or iPad</h3>
              <p>
                When served over HTTPS, open in Safari and choose Share → Add to
                Home Screen. After the first complete load, the production app
                caches its lessons and 3D code for offline use. Progress stays
                on this device; it does not sync between your iPhone and iPad.
              </p>
            </div>
          </section>
        )}
        <footer>
          <span>WOODCRAFTING / FIELD NOTES 001</span>
          <span role="status">
            {storageError
              ? "Progress could not be saved. Keep this tab open."
              : "Progress saved on this device"}
          </span>
        </footer>
      </main>
    </div>
  );
}
