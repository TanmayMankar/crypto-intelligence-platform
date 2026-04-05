import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

const gridColor = "rgba(148, 163, 184, 0.12)";
const tickColor = "rgba(148, 163, 184, 0.85)";
const legendColor = "rgba(226, 232, 240, 0.9)";

export default function RSIChart({ rsi = [] }) {
  const data = {
    labels: rsi.map((_, i) => i + 1),
    datasets: [
      {
        label: "RSI",
        data: rsi,
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167, 139, 250, 0.06)",
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          color: legendColor,
          boxWidth: 10,
          boxHeight: 10,
          padding: 16,
          font: { size: 11, family: "'DM Sans', sans-serif" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 17, 24, 0.94)",
        titleColor: legendColor,
        bodyColor: "rgba(203, 213, 225, 0.95)",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: tickColor,
          maxRotation: 0,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: tickColor,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Line data={data} options={options} />
    </div>
  );
}
