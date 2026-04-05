import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const TABS = [
  { id: "home", label: "Home" },
  { id: "analytics", label: "Analytics" },
  { id: "predictions", label: "Predictions" },
  { id: "whale", label: "Whale Activity" },
  { id: "about", label: "About" },
];

export default function Navbar({
  activeTab,
  onNavigate,
  showTabs = true,
}) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav
      className="sticky top-0 z-[60] min-h-14 border-b border-white/[0.08] bg-terminal-canvas/95 backdrop-blur-md supports-[backdrop-filter]:bg-terminal-canvas/90"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-white transition-colors hover:text-cyan-300/95 sm:text-xl"
            onClick={() => onNavigate("home")}
          >
            Crypto Intelligence Platform
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-slate-100"
                  title="Alerts (coming soon)"
                >
                  Alerts
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-slate-100"
                  title="Profile (coming soon)"
                >
                  Profile
                </button>
                <span
                  className="hidden max-w-[10rem] truncate text-xs text-terminal-muted sm:inline"
                  title={user.email}
                >
                  {user.email}
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-white/[0.1] px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
                  onClick={logout}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {location.pathname !== "/login" ? (
                  <Link
                    to="/login"
                    className="rounded-lg bg-cyan-500/15 px-3.5 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-500/35 transition-all duration-200 hover:bg-cyan-500/25"
                  >
                    Login
                  </Link>
                ) : null}
                {location.pathname !== "/register" ? (
                  <Link
                    to="/register"
                    className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-slate-100"
                  >
                    Register
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {showTabs ? (
          <div
            className="-mx-1 flex flex-wrap items-center justify-end gap-1 sm:gap-0.5"
            role="tablist"
            aria-label="Sections"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out sm:px-3.5 ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/35"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                  }`}
                  onClick={() => onNavigate(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
