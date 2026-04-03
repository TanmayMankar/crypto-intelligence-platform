import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PriceChart from "./PriceChart";
import RSIChart from "./RSIChart";



const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

function App() {
  const [prices, setPrices] = useState([]);
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
        const ma = data.movingAverage5
          .slice(0, 50);

        const rsiValues = data.rsi.slice(0, 50);

        // console.log("Analytics loaded:", data);

        setMa5(ma);
        setRsi(rsiValues);
        setSignal(data.signal);
      });
  },[history]);

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
      console.log("Received Prices : ",data);
      setPrices(data);

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
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 className="text-4xl text-cyan-400 font-bold">
        Crypto Intelligence Platform
      </h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price (USD)</th>
          </tr>
        </thead>

        <tbody>
          {prices.map((coin, index) => (
            <tr key={index}>
              <td>{coin.symbol}</td>
              <td>{coin.name}</td>
              <td>${coin.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Prediction Engine</h2>

      {prediction && (
        <div>
          <p>Current Price: ${prediction.current_price}</p>
          <p>Predicted Price: ${prediction.predicted_price}</p>
        </div>
      )}

      <h2>Whale Activity</h2>

      {whale?.alert ? (
        <div style={{ color: "red", fontWeight: "bold" }}>
          🐋 Whale {whale.type} detected ({whale.percent}%)
        </div>
      ) : (
        <div style={{ color: "lightgreen" }}>No whale activity detected</div>
      )}

      <h2>Whale Predictor</h2>
      <h3>Probability: {whaleProbability}%</h3>

      <p>
        {whaleProbability > 70
          ? "🐋 Strong whale activity expected"
          : whaleProbability > 40
            ? "⚠ Possible whale movement"
            : "Market stable"}
      </p>

      <h2>{selectedCoin} Price History</h2>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <button onClick={() => setSelectedCoin("BTC")}>BTC</button>
        <button
          onClick={() => setSelectedCoin("ETH")}
          style={{ marginLeft: "10px" }}
        >
          ETH
        </button>
        <button
          onClick={() => setSelectedCoin("SOL")}
          style={{ marginLeft: "10px" }}
        >
          SOL
        </button>
      </div>
      <PriceChart prices={history} coin={selectedCoin} ma5={ma5} />
      <h2>Trading Signal</h2>
      <h3>{signal}</h3>

      <h2>RSI Indicator</h2>
      <RSIChart rsi={rsi} />
    </div>
  );
}

export default App;
