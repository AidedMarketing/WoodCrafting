import { Compass, BookOpen } from "lucide-react";
export function Header({
  prepare = false,
  onMenu,
  onPrepare,
  status,
}: {
  prepare?: boolean;
  onMenu: () => void;
  onPrepare: () => void;
  status?: string;
}) {
  return (
    <header className="header">
      <a
        href={import.meta.env.BASE_URL}
        className="brand"
        onClick={(e) => {
          e.preventDefault();
          onMenu();
        }}
      >
        <img
          className="brand-icon"
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt=""
          width="46"
          height="46"
        />
        <span>
          WoodCrafting<small>A PERSONAL PRACTICE</small>
        </span>
      </a>
      <nav aria-label="Main navigation">
        <button
          className={!prepare ? "nav-item selected" : "nav-item"}
          onClick={onMenu}
        >
          <Compass size={18} />
          Workbench
        </button>
        <button
          className={prepare ? "nav-item selected" : "nav-item"}
          onClick={onPrepare}
        >
          <BookOpen size={18} />
          Before you carve
        </button>
      </nav>
      <span className="local-state">{status || "Your personal workshop"}</span>
    </header>
  );
}
