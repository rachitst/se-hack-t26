import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InventoryData {
  category: string;
  count: number;
}

interface InventoryChartProps {
  data: InventoryData[];
}

const InventoryChart: React.FC<InventoryChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Number of Items',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
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
        text: 'Inventory by Category'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Items'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Category'
        }
      }
    }
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default InventoryChart; 