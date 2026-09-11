import { useState } from "react";
import { ArrowRight, BookOpen, Check, Leaf } from "lucide-react";
import { Header } from "./Header";
import Workbench from "./Workbench";
import { projects, type ProjectId } from "./projects";
import { usePwa } from "./usePwa";
import { readProgress } from "./progress.js";
function initialSelection() {
  const p = new URLSearchParams(location.search).get("project");
  return p === "egg" || p === "mushroom" ? p : null;
}
export default function App() {
  const status = usePwa();
  const [selected, setSelected] = useState<ProjectId | null>(initialSelection);
  const [prepare, setPrepare] = useState(false);
  function open(id: ProjectId, preparation = false) {
    setPrepare(preparation);
    setSelected(id);
    const url = new URL(location.href);
    url.searchParams.set("project", id);
    history.replaceState(null, "", url);
    window.scrollTo(0, 0);
  }
  function menu() {
    setSelected(null);
    setPrepare(false);
    const url = new URL(location.href);
    url.searchParams.delete("project");
    history.replaceState(null, "", url);
    window.scrollTo(0, 0);
  }
  if (selected)
    return (
      <Workbench
        status={status}
        key={`${selected}-${prepare}`}
        projectId={selected}
        initialPage={prepare ? "prepare" : "workbench"}
        onMenu={menu}
      />
    );
  return (
    <div className="app">
      <Header
        status={status}
        onMenu={menu}
        onPrepare={() => open("egg", true)}
      />
      <main className="library">
        <div className="library-heading">
          <div>
            <p className="eyebrow">YOUR WORKBENCH</p>
            <h1>What will you make?</h1>
            <p>Choose a small project. Learn one cut at a time.</p>
          </div>
          <span className="library-count">
            02 <small>guided projects</small>
          </span>
        </div>
        <div className="project-grid">
          {(Object.keys(projects) as ProjectId[]).map((id, index) => {
            const p = projects[id],
              progress = readProgress(localStorage, id, p.stages.length);
            return (
              <article className="project-tile" key={id}>
                <button
                  className="project-art"
                  onClick={() => open(id)}
                  aria-label={`Open ${p.name}`}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}models/${id}.png`}
                    alt={`Wooden ${p.name} with softly carved facets`}
                    width="700"
                    height="560"
                  />
                  <span className="project-order">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {index === 0 ? "PRACTICE" : "CREATE"}
                  </span>
                </button>
                <div className="project-copy">
                  <p className="eyebrow">{p.recommended}</p>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <div className="project-facts">
                    <span>Basswood</span>
                    <span>1 knife</span>
                    <span>{p.stages.length} stages</span>
                  </div>
                  <div className="project-bottom">
                    <span>
                      {progress.done.length === p.stages.length ? (
                        <>
                          <Check size={14} /> Complete
                        </>
                      ) : progress.done.length ? (
                        `${progress.done.length} of ${p.stages.length} complete`
                      ) : (
                        "No experience needed"
                      )}
                    </span>
                    <button className="primary" onClick={() => open(id)}>
                      {progress.stage || progress.done.length
                        ? "Continue project"
                        : "Explore project"}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <section className="library-start">
          <div className="library-start-icon">
            <BookOpen size={23} />
          </div>
          <div>
            <h2>New to the knife? Start here.</h2>
            <p>
              Your first tools, choosing wood, and setting up for a safe
              practice session.
            </p>
          </div>
          <button onClick={() => open("egg", true)}>
            Before you carve <ArrowRight size={18} />
          </button>
        </section>
        <div className="next-project">
          <Leaf size={20} />
          <div>
            <strong>Next on the bench: a spoon</strong>
            <p>
              A future lesson in hollowing and working with a hook knife. Not
              available yet.
            </p>
          </div>
        </div>
        <footer>
          <span>WOODCRAFTING / YOUR PERSONAL PRACTICE</span>
          <span>Progress stays on this device</span>
        </footer>
      </main>
    </div>
  );
}
