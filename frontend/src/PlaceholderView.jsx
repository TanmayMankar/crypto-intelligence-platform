const TITLES = {
  analytics: "Analytics",
  predictions: "Predictions",
  whale: "Whale Activity",
  about: "About",
};

export default function PlaceholderView({ tab }) {
  const title = TITLES[tab] ?? "Page";

  return (
    <div className="fade-in mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-terminal-raised/90 to-terminal-surface p-8 shadow-card card-hover">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Coming soon
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-4 leading-relaxed text-terminal-muted">
          This section is a placeholder. The full experience is available on{" "}
          <span className="text-slate-300">Home</span>.
        </p>
      </div>
    </div>
  );
}
