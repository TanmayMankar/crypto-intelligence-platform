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

export default function PriceChart({ prices = [],ma5 = [], coin }) {
  const data = {
    labels: prices.map((_, i) => i + 1), // simple index labels
    datasets: [
      {
        label: `${coin} Price (USD)`,
        data: prices,
        borderColor: "cyan",
        backgroundColor: "rgba(0,255,255,0.2)",
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: "MA 5",
        data: ma5,
        borderColor: "orange",
        tension: 0.3,
        pointRadius: 0,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `$${v}`,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line key={prices.length} data={data} options={options} />
    </div>
  );
}
