import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CorrelationHeatmap = ({ data, stocks }) => {
  if (!data) return null;

  // Prepare data for the heatmap
  const heatmapData = [];
  const stockTickers = Object.values(stocks);
  
  stockTickers.forEach((tickerX, i) => {
    stockTickers.forEach((tickerY, j) => {
      if (i <= j) { // Only show upper or lower triangle to avoid duplicates
        heatmapData.push({
          x: tickerX,
          y: tickerY,
          z: data[i][j],
        });
      }
    });
  });

  // Color scale based on correlation value
  const getColor = (value) => {
    if (value >= 0.7) return '#2E8B57'; // Strong positive
    if (value >= 0.3) return '#90EE90'; // Positive
    if (value >= -0.3) return '#F5F5DC'; // Neutral
    if (value >= -0.7) return '#FFA07A'; // Negative
    return '#CD5C5C'; // Strong negative
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Stock Correlation Heatmap
      </Typography>
      <Box sx={{ height: '500px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              name="Stock" 
              tick={{ fontSize: 12 }} 
              interval={0}
            />
            <YAxis 
              dataKey="y" 
              name="Stock" 
              tick={{ fontSize: 12 }} 
              interval={0}
            />
            <ZAxis dataKey="z" range={[-1, 1]} name="Correlation" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              formatter={(value, name, props) => {
                if (name === 'Correlation') {
                  return [value.toFixed(3), name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Scatter name="Correlation" data={heatmapData}>
              {heatmapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#2E8B57', mr: 1 }} />
            <Typography variant="caption">Strong Positive (0.7-1.0)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#90EE90', mr: 1 }} />
            <Typography variant="caption">Positive (0.3-0.7)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#F5F5DC', mr: 1 }} />
            <Typography variant="caption">Neutral (-0.3-0.3)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#FFA07A', mr: 1 }} />
            <Typography variant="caption">Negative (-0.7--0.3)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#CD5C5C', mr: 1 }} />
            <Typography variant="caption">Strong Negative (-1.0--0.7)</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CorrelationHeatmap;