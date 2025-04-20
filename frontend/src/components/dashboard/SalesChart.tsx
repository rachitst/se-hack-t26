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

interface SalesData {
  warehouse: string;
  amount: number;
}

interface SalesChartProps {
  data: SalesData[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.warehouse),
    datasets: [
      {
        label: 'Sales Amount',
        data: data.map(item => item.amount),
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
        text: 'Sales by Warehouse'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`
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

export default SalesChart; 