const SYMBOLS = ["BTC", "ETH", "SOL"];

function getCoin(list, symbol) {
  return list?.find((c) => c.symbol === symbol);
}

function TapeSegment({ prices, prevPrices, idPrefix }) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
      aria-hidden={idPrefix === "b"}
    >
      {SYMBOLS.map((sym, idx) => {
        const cur = getCoin(prices, sym);
        const prev = getCoin(prevPrices, sym);
        const price = cur?.price;
        const prevPrice = prev?.price;

        let colorClass = "text-slate-300";
        if (
          prevPrice != null &&
          price != null &&
          Number(price) > Number(prevPrice)
        ) {
          colorClass = "text-emerald-400";
        } else if (
          prevPrice != null &&
          price != null &&
          Number(price) < Number(prevPrice)
        ) {
          colorClass = "text-red-400";
        }

        const label = cur?.name ? String(cur.name).split(" ")[0] : sym;

        return (
          <div
            key={`${idPrefix}-${sym}-${idx}`}
            className="flex items-baseline gap-3 whitespace-nowrap"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-400/95">
              {sym}
            </span>
            <span className="hidden text-[10px] text-terminal-muted sm:inline">
              {label}
            </span>
            <span
              key={`${sym}-${price}`}
              className={`inline-block rounded px-0.5 font-mono text-sm font-semibold tabular-nums ${colorClass} ${
                prevPrice != null &&
                price != null &&
                Number(price) > Number(prevPrice)
                  ? "price-flash-up"
                  : prevPrice != null &&
                      price != null &&
                      Number(price) < Number(prevPrice)
                    ? "price-flash-down"
                    : ""
              }`}
            >
              {price != null ? `$${Number(price).toLocaleString()}` : "—"}
            </span>
            {idx < SYMBOLS.length - 1 ? (
              <span
                className="select-none text-white/15 sm:ml-2"
                aria-hidden
              >
                |
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function MarketTicker({ prices = [], prevPrices = [] }) {
  return (
    <div
      className="fade-in sticky top-14 z-40 flex w-full border-b border-white/[0.08] bg-terminal-canvas/90 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md supports-[backdrop-filter]:bg-terminal-canvas/80"
      role="region"
      aria-label="Market price ticker"
    >
      <div className="flex shrink-0 items-center gap-2 border-r border-white/[0.08] bg-black/35 px-3 py-2.5 sm:px-4">
        <span
          className="relative flex h-2 w-2"
          aria-hidden
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/30 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400/90 sm:inline">
          Tape
        </span>
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden py-2 sm:py-2.5">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-terminal-canvas from-20% to-transparent motion-reduce:hidden sm:w-14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-terminal-canvas from-20% to-transparent motion-reduce:hidden sm:w-14"
          aria-hidden
        />

        <div className="hidden justify-center px-4 motion-reduce:flex">
          <TapeSegment
            idPrefix="static"
            prices={prices}
            prevPrices={prevPrices}
          />
        </div>

        <div className="flex w-max animate-ticker-scroll motion-reduce:hidden">
          <TapeSegment
            idPrefix="a"
            prices={prices}
            prevPrices={prevPrices}
          />
          <TapeSegment
            idPrefix="b"
            prices={prices}
            prevPrices={prevPrices}
          />
        </div>
      </div>
    </div>
  );
}
