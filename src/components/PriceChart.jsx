import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PriceChart({ products }) {
  const data = {
    labels: products.map((product) => product.store),
    datasets: [
      {
        label: 'Precio (ARS)',
        data: products.map((product) => product.price),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb', // Color claro para el texto del legend
        },
      },
      title: {
        display: true,
        text: 'Comparación de Precios',
        color: '#e5e7eb', // Color claro para el título
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e5e7eb', // Color claro para las etiquetas del eje X
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Líneas de cuadrícula claras
        },
      },
      y: {
        ticks: {
          color: '#e5e7eb', // Color claro para las etiquetas del eje Y
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Líneas de cuadrícula claras
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
}

export default PriceChart;