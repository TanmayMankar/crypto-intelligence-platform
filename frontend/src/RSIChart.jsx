import { Line } from "react-chartjs-2";

export default function RSIChart({ rsi = [] }) {
  const data = {
    labels: rsi.map((_, i) => i + 1),
    datasets: [
      {
        label: "RSI",
        data: rsi,
        borderColor: "purple",
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return <Line data={data} options={options} />;
}
