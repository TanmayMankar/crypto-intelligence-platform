export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-black/25 py-10 text-sm text-terminal-muted">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-2">
          <p className="font-semibold text-slate-200">
            Crypto Intelligence Platform
          </p>
          <p className="max-w-md leading-relaxed">
            AI-powered market analytics dashboard
          </p>
          <p className="text-xs text-slate-500">
            Built with React, Tailwind, and WebSockets
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Links
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              className="text-slate-400 transition-colors duration-200 hover:text-cyan-400/90"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="text-slate-400 transition-colors duration-200 hover:text-cyan-400/90"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Documentation
            </a>
            <a
              className="text-slate-400 transition-colors duration-200 hover:text-cyan-400/90"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              API status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
