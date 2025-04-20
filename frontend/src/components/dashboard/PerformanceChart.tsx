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

interface StockMovement {
  _id: {
    date: string;
    type: string;
  };
  count: number;
}

interface PerformanceChartProps {
  data: StockMovement[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  // Group data by date and type
  const groupedData = data.reduce((acc, movement) => {
    const date = movement._id.date;
    const type = movement._id.type;
    if (!acc[date]) {
      acc[date] = {
        active: 0,
        inactive: 0,
        low_stock: 0
      };
    }
    acc[date][type] = movement.count;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'Active Products',
        data: Object.values(groupedData).map(d => d.active),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.1
      },
      {
        label: 'Low Stock',
        data: Object.values(groupedData).map(d => d.low_stock),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.1
      },
      {
        label: 'Inactive',
        data: Object.values(groupedData).map(d => d.inactive),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        tension: 0.1
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
        text: 'Product Status Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Products'
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;