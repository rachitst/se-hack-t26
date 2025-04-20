import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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

interface StockMovementData {
  date: string;
  in: number;
  out: number;
}

interface StockChartProps {
  data: StockMovementData[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Stock In',
        data: data.map(item => item.in),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Stock Out',
        data: data.map(item => item.out),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock Movements (Last 30 Days)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart; 