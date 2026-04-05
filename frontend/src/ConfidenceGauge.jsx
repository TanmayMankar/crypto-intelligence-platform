import { useEffect, useId, useState } from "react";

const R = 44;
const C = 2 * Math.PI * R;

/** Map existing prices to a 0–100 signal strength (no backend change). ~3% move → full scale. */
function deriveSignal(current, predicted) {
  const cur = Number(current);
  const pred = Number(predicted);
  if (!Number.isFinite(cur) || cur === 0 || !Number.isFinite(pred)) {
    return { confidence: 0, direction: "flat" };
  }
  const delta = pred - cur;
  if (Math.abs(delta / cur) < 1e-12) {
    return { confidence: 0, direction: "flat" };
  }
  const absPct = Math.abs(delta / cur) * 100;
  const confidence = Math.min(100, (absPct / 3) * 100);
  const direction = delta > 0 ? "bull" : "bear";
  return { confidence, direction };
}

function useAnimatedConfidence(target, resetKey) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);
    const start = performance.now();
    const duration = 950;
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    let raf;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, resetKey]);

  return value;
}

export default function ConfidenceGauge({ currentPrice, predictedPrice }) {
  const filterUid = useId().replace(/:/g, "");
  const { confidence: targetConf, direction } = deriveSignal(
    currentPrice,
    predictedPrice,
  );
  const resetKey = `${currentPrice}-${predictedPrice}`;
  const animated = useAnimatedConfidence(targetConf, resetKey);

  const strokeColor =
    direction === "bull"
      ? "#34d399"
      : direction === "bear"
        ? "#f87171"
        : "#64748b";

  const offset = C * (1 - animated / 100);
  const displayPct = Math.round(animated);

  const outlook =
    direction === "bull"
      ? "bullish outlook"
      : direction === "bear"
        ? "bearish outlook"
        : "neutral outlook";

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative h-[132px] w-[132px]"
        role="img"
        aria-label={`AI confidence ${displayPct} percent, ${outlook}`}
      >
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <filter
              id={`gauge-glow-${filterUid}`}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            className="transition-[stroke] duration-300"
            filter={`url(#gauge-glow-${filterUid})`}
            style={{
              opacity: direction === "flat" && targetConf === 0 ? 0.35 : 1,
            }}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-0.5">
          <span
            className={`font-mono text-2xl font-semibold tabular-nums leading-none ${
              direction === "bull"
                ? "text-emerald-400"
                : direction === "bear"
                  ? "text-red-400"
                  : "text-slate-400"
            }`}
          >
            {displayPct}%
          </span>
          <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-terminal-muted">
            AI confidence
          </span>
        </div>
      </div>
      <p className="mt-1 max-w-[11rem] text-center text-[11px] leading-snug text-terminal-muted">
        {direction === "bull" && "Bullish outlook"}
        {direction === "bear" && "Bearish outlook"}
        {direction === "flat" && "Neutral — no directional edge"}
      </p>
    </div>
  );
}
