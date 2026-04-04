import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PriceChart from "./PriceChart";
import RSIChart from "./RSIChart";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

function App() {
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

  useEffect(() => {
    fetch("http://localhost:3000/crypto/prices")
      .then((res) => res.json())
      .then((data) => {
        setPrices(data);
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold text-cyan-400 mb-10 text-center">
        Crypto Intelligence Platform
      </h1>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT PANEL */}
        <div className="col-span-4 space-y-6">
          {/* Live Prices */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Live Prices</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-slate-700">
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-right py-2">Price (USD)</th>
                </tr>
              </thead>

              <tbody>
                {prices.map((coin, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                  >
                    <td className="py-2 font-semibold text-cyan-400">
                      {coin.symbol}
                    </td>

                    <td className="py-2 text-gray-300">{coin.name}</td>

                    <td className="py-2 text-right font-bold">
                      <span
                        className={
                          prevPrices[index] &&
                          coin.price > prevPrices[index].price
                            ? "text-green-400"
                            : prevPrices[index] &&
                                coin.price < prevPrices[index].price
                              ? "text-red-400"
                              : "text-gray-300"
                        }
                      >
                        ${Number(coin.price).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prediction */}
          <div className="bg-slate-800 border border-cyan-500/20 rounded-xl p-5 shadow-xl">
            <h2 className="text-lg font-bold text-cyan-400 mb-3">
              Prediction Engine
            </h2>

            {prediction && (
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Current Price</span>
                  <span className="font-semibold text-white">
                    ${prediction.current_price}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Predicted Price</span>
                  <span className="font-semibold text-green-400">
                    ${prediction.predicted_price}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Whale Activity */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-cyan-400 mb-2">
              Whale Activity
            </h2>

            {whale?.alert ? (
              <div className="text-red-400 font-semibold">
                🐋 Whale {whale.type} detected ({whale.percent}%)
              </div>
            ) : (
              <div className="text-green-400">No whale activity detected</div>
            )}

            <p className="text-gray-300 mt-2">
              Whale Probability: {whaleProbability}%
            </p>
          </div>

          {/* Trading Signal */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-cyan-400 mb-2">
              Trading Signal
            </h2>

            <h3
              className={
                signal === "BUY"
                  ? "text-green-400 text-xl font-bold"
                  : signal === "SELL"
                    ? "text-red-400 text-xl font-bold"
                    : "text-yellow-400 text-xl font-bold"
              }
            >
              {signal}
            </h3>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-8 space-y-6">
          {/* Price Chart */}
          <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedCoin} Price Chart
              </h2>

              <div className="flex gap-2">
                <button
                  className="bg-cyan-500 hover:bg-cyan-400 px-3 py-1 rounded"
                  onClick={() => setSelectedCoin("BTC")}
                >
                  BTC
                </button>

                <button
                  className="bg-cyan-500 hover:bg-cyan-400 px-3 py-1 rounded"
                  onClick={() => setSelectedCoin("ETH")}
                >
                  ETH
                </button>

                <button
                  className="bg-cyan-500 hover:bg-cyan-400 px-3 py-1 rounded"
                  onClick={() => setSelectedCoin("SOL")}
                >
                  SOL
                </button>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <PriceChart prices={history} coin={selectedCoin} ma5={ma5} />
            </div>
          </div>

          {/* RSI */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">RSI Indicator</h2>

            <div className="h-[250px]">
              <RSIChart rsi={rsi} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
