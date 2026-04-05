import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

const gridColor = "rgba(148, 163, 184, 0.12)";
const tickColor = "rgba(148, 163, 184, 0.85)";
const legendColor = "rgba(226, 232, 240, 0.9)";

export default function PriceChart({ prices = [], ma5 = [], coin }) {
  const data = {
    labels: prices.map((_, i) => i + 1), // simple index labels
    datasets: [
      {
        label: `${coin} Price (USD)`,
        data: prices,
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34, 211, 238, 0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "MA 5",
        data: ma5,
        borderColor: "#fbbf24",
        backgroundColor: "transparent",
        tension: 0.35,
        pointRadius: 0,
        spanGaps: true,
        borderWidth: 1.5,
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
        displayColors: true,
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
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: tickColor,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
          callback: (v) => `$${v}`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Line key={prices.length} data={data} options={options} />
    </div>
  );
}
