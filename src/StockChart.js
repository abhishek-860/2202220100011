import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
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
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ data, stockName, stockTicker }) => {
  if (!data || data.length === 0) return null;

  // Calculate average price
  const averagePrice = data.reduce((sum, item) => sum + item.price, 0) / data.length;

  // Prepare chart data
  const chartData = {
    labels: data.map(item => new Date(item.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Stock Price',
        data: data.map(item => item.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Average Price',
        data: Array(data.length).fill(averagePrice),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${stockName} (${stockTicker}) - Price History`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: $${context.parsed.y.toFixed(2)}`;
            }
            return null;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </Box>
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
        Average Price: ${averagePrice.toFixed(2)}
      </Typography>
    </Paper>
  );
};

export default StockChart;