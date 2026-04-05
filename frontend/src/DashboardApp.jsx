import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PriceChart from "./PriceChart";
import ConfidenceGauge from "./ConfidenceGauge";
import MarketTicker from "./MarketTicker";
import RSIChart from "./RSIChart";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PlaceholderView from "./PlaceholderView";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const cardBase =
  "rounded-2xl border border-white/[0.06] bg-gradient-to-b from-terminal-raised/95 to-terminal-surface shadow-card card-hover glow-hover";
const cardHeader =
  "flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4";
const cardBody = "px-5 py-4";

export default function DashboardApp() {
  const [navTab, setNavTab] = useState("home");
  const [prices, setPrices] = useState([]);
  const [prevPrices, setPrevPrices] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [ma5, setMa5] = useState([]);
  const [rsi, setRsi] = useState([]);
  const [signal, setSignal] = useState("HOLD");
  const [prediction, setPrediction] = useState(null);
  const [whale, setWhale] = useState(null);
  const [whaleProbability, setWhaleProbability] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:3000/crypto/prices")
      .then((res) => res.json())
      .then((data) => {
        setPrices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          "Unable to fetch live crypto prices. Please check backend connection.",
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/crypto/whale/${selectedCoin}`)
      .then((res) => res.json())
      .then((data) => setWhale(data));
  }, [history]);

  useEffect(() => {
    fetch(`http://localhost:3000/crypto/predict/${selectedCoin}`)
      .then((res) => res.json())
      .then((data) => {
        setPrediction(data);
      });
  }, [history]);

  useEffect(() => {
    fetch(`http://localhost:3000/crypto/whale-predict/${selectedCoin}`)
      .then((res) => res.json())
      .then((data) => {
        setWhaleProbability(data.whaleProbability);
      });
  }, [history, selectedCoin]);

  useEffect(() => {
    fetch(`http://localhost:3000/crypto/analytics/${selectedCoin}`)
      .then((res) => res.json())
      .then((data) => {
        const ma = data.movingAverage5.slice(0, 50);

        const rsiValues = data.rsi.slice(0, 50);

        // console.log("Analytics loaded:", data);

        setMa5(ma);
        setRsi(rsiValues);
        setSignal(data.signal);
      });
  }, [history]);

  useEffect(() => {
    fetch(`http://localhost:3000/crypto/history/${selectedCoin}`)
      .then((res) => res.json())
      .then((data) => {
        const prices = data
          .slice(0, 50) // take last 50 records
          .map((d) => d.price)
          .reverse(); // put them in correct order

        console.log("History loaded:", prices);

        setHistory(prices);
        // const ma = calculateMA(prices, 5);
        // setMa5(ma);

        // const rsiValues = calculateRSI(prices, 14);
        // setRsi(rsiValues);

        // const newSignal = calculateSignal(prices, ma, rsiValues);
        // setSignal(newSignal);
      });
  }, [selectedCoin]);

  useEffect(() => {
    const handlePrices = (data) => {
      console.log("Received Prices : ", data);
      setPrevPrices((oldPrev) => prices);
      setPrices(data);

      console.log("Prev Prices : ", prevPrices);
      console.log("Current Prices : ", prices);

      if (loadingHistory) return; // prevent mixing history

      const coin = data.find((c) => c.symbol === selectedCoin);

      if (!coin) return;

      setHistory((prev) => {
        const updated = [...prev, coin.price];

        if (updated.length > 50) {
          updated.shift();
        }

        return updated;
      });
    };

    socket.on("prices", handlePrices);

    return () => socket.off("prices", handlePrices);
  }, [selectedCoin, loadingHistory]);

  const coins = ["BTC", "ETH", "SOL"];

  return (
    <div className="relative flex min-h-screen flex-col background-gradient-animate">
      <Navbar activeTab={navTab} onNavigate={setNavTab} />

      {navTab === "home" ? (
        <>
          <MarketTicker prices={prices} prevPrices={prevPrices} />
          <div className="relative mx-auto w-full max-w-[1600px] flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
            <header className="fade-in mb-8 flex flex-col gap-5 border-b border-white/[0.06] pb-8 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-400/90">
                  Live market desk
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Overview
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-terminal-muted">
                  Streaming prices, technical signals, and model outputs in a
                  compact trading layout.
                </p>
              </div>
              <div className="glow-hover flex shrink-0 items-center gap-3 self-start rounded-xl border border-white/[0.08] bg-terminal-surface/90 px-4 py-2.5 shadow-card backdrop-blur-sm lg:self-auto">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/35 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-slate-100">
                    Feed connected
                  </p>
                  <p className="text-[11px] text-terminal-muted">WebSocket</p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:gap-6">
              <div className="space-y-5 xl:col-span-4">
                <section className={`${cardBase} fade-in fade-in-delay-2`}>
                  <div className={cardHeader}>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Live prices
                    </h2>
                    <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] font-medium text-terminal-muted">
                      USD
                    </span>
                  </div>
                  {loading && (
                    <p className="text-yellow-400 px-5 py-2">
                      Loading live crypto data...
                    </p>
                  )}
                  {error && <p className="text-red-500 px-5 py-2">{error}</p>}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-terminal-muted">
                          <th className="px-5 py-3">Symbol</th>
                          <th className="px-3 py-3">Asset</th>
                          <th className="px-5 py-3 text-right">Last</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {prices.map((coin, index) => (
                          <tr
                            key={coin.symbol}
                            className="transition-colors hover:bg-white/[0.03]"
                          >
                            <td className="px-5 py-3 font-mono text-xs font-semibold text-cyan-400">
                              {coin.symbol}
                            </td>
                            <td className="max-w-[8rem] truncate px-3 py-3 text-slate-400">
                              {coin.name}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span
                                key={`${coin.symbol}-${coin.price}`}
                                className={`inline-block rounded px-1 font-mono text-sm font-semibold tabular-nums ${
                                  prevPrices[index] &&
                                  coin.price > prevPrices[index].price
                                    ? "text-emerald-400 price-flash-up"
                                    : prevPrices[index] &&
                                        coin.price < prevPrices[index].price
                                      ? "text-red-400 price-flash-down"
                                      : "text-slate-200"
                                }`}
                              >
                                ${Number(coin.price).toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section
                  className={`${cardBase} fade-in fade-in-delay-3 border-cyan-500/20 shadow-card-glow`}
                >
                  <div className={cardHeader}>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300/95">
                      Prediction engine
                    </h2>
                  </div>
                  <div className={`${cardBody}`}>
                    {prediction && (
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                        {/* <ConfidenceGauge
                      currentPrice={prediction.current_price}
                      predictedPrice={prediction.predicted_price}
                    /> */}
                        <dl className="min-w-0 flex-1 space-y-3 text-sm">
                          <div className="flex items-center justify-between gap-4 rounded-lg bg-black/25 px-3 py-2.5 ring-1 ring-white/[0.04]">
                            <dt className="text-terminal-muted">Current</dt>
                            <dd className="font-mono font-semibold tabular-nums text-white">
                              ${prediction.current_price}
                            </dd>
                          </div>
                          <div
                            className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 ring-1 ${
                              Number(prediction.predicted_price) >
                              Number(prediction.current_price)
                                ? "bg-emerald-500/[0.08] ring-emerald-500/25"
                                : Number(prediction.predicted_price) <
                                    Number(prediction.current_price)
                                  ? "bg-red-500/[0.08] ring-red-500/25"
                                  : "bg-white/[0.04] ring-white/[0.06]"
                            }`}
                          >
                            <dt
                              className={
                                Number(prediction.predicted_price) >
                                Number(prediction.current_price)
                                  ? "text-emerald-200/85"
                                  : Number(prediction.predicted_price) <
                                      Number(prediction.current_price)
                                    ? "text-red-200/85"
                                    : "text-terminal-muted"
                              }
                            >
                              Predicted
                            </dt>
                            <dd
                              className={`font-mono font-semibold tabular-nums ${
                                Number(prediction.predicted_price) >
                                Number(prediction.current_price)
                                  ? "text-emerald-400"
                                  : Number(prediction.predicted_price) <
                                      Number(prediction.current_price)
                                    ? "text-red-400"
                                    : "text-slate-300"
                              }`}
                            >
                              ${prediction.predicted_price}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </section>

                <section className={`${cardBase} fade-in fade-in-delay-4`}>
                  <div className={cardHeader}>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Whale activity
                    </h2>
                  </div>
                  <div className={`${cardBody} space-y-3`}>
                    {whale?.alert ? (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                          Alert
                        </p>
                        <p className="mt-1 text-sm font-medium text-red-100">
                          Whale {whale.type} · {whale.percent}%
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3 text-sm font-medium text-emerald-300/95">
                        No unusual whale activity
                      </div>
                    )}
                    <p className="text-xs text-terminal-muted">
                      Model probability:{" "}
                      <span className="font-mono font-medium text-slate-300">
                        {whaleProbability}%
                      </span>
                    </p>
                  </div>
                </section>

                <section className={`${cardBase} fade-in fade-in-delay-5`}>
                  <div className={cardHeader}>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Trading signal
                    </h2>
                  </div>
                  <div className={cardBody}>
                    <div
                      className={`inline-flex min-w-[7rem] items-center justify-center rounded-lg px-4 py-3 font-mono text-lg font-bold tracking-wide ring-1 ${
                        signal === "BUY"
                          ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
                          : signal === "SELL"
                            ? "bg-red-500/15 text-red-400 ring-red-500/30"
                            : "bg-amber-500/10 text-amber-300 ring-amber-500/25"
                      }`}
                    >
                      {signal}
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-5 xl:col-span-8">
                <section className={`${cardBase} fade-in fade-in-delay-3 p-0`}>
                  <div className={`${cardHeader} px-6`}>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {selectedCoin} price
                      </h2>
                      <p className="mt-0.5 text-xs text-terminal-muted">
                        Last 50 points · MA(5) overlay
                      </p>
                    </div>
                    <div
                      className="inline-flex rounded-lg border border-white/[0.08] bg-black/35 p-1"
                      role="group"
                      aria-label="Select asset"
                    >
                      {coins.map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                            selectedCoin === sym
                              ? "bg-cyan-500/20 text-cyan-200 shadow-inner ring-1 ring-cyan-500/35"
                              : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-200"
                          }`}
                          onClick={() => setSelectedCoin(sym)}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/[0.05] px-4 pb-5 pt-2 sm:px-6">
                    <div className="h-[min(420px,55vh)] w-full min-h-[280px]">
                      <PriceChart
                        prices={history}
                        coin={selectedCoin}
                        ma5={ma5}
                      />
                    </div>
                  </div>
                </section>

                <section className={`${cardBase} fade-in fade-in-delay-4 p-0`}>
                  <div className={`${cardHeader} px-6`}>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        RSI
                      </h2>
                      <p className="mt-0.5 text-xs text-terminal-muted">
                        Relative strength · 0–100
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/[0.05] px-4 pb-5 pt-2 sm:px-6">
                    <div className="h-[min(280px,36vh)] w-full min-h-[220px]">
                      <RSIChart rsi={rsi} />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </>
      ) : (
        <main className="relative flex-1">
          <PlaceholderView tab={navTab} />
        </main>
      )}

      <Footer />
    </div>
  );
}
