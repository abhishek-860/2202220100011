import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { fetchStocks, fetchStockData } from '../api/stockApi';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import TimeIntervalSelector from '../components/TimeIntervalSelector';
import { calculateCorrelationMatrix } from '../utils/calculations';

const CorrelationPage = () => {
  const [stocks, setStocks] = useState({});
  const [timeInterval, setTimeInterval] = useState(60);
  const [correlationData, setCorrelationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocksData = await fetchStocks();
        setStocks(stocksData);
      } catch (error) {
        console.error('Failed to load stocks:', error);
      }
    };
    loadStocks();
  }, []);

  useEffect(() => {
    if (Object.keys(stocks).length > 0) {
      const loadCorrelationData = async () => {
        setLoading(true);
        try {
          // Fetch data for all stocks
          const stockTickers = Object.values(stocks);
          const allStockData = await Promise.all(
            stockTickers.map(ticker => fetchStockData(ticker, timeInterval))
          );
          
          // Calculate correlation matrix
          const matrix = calculateCorrelationMatrix(allStockData, stockTickers);
          setCorrelationData(matrix);
        } catch (error) {
          console.error('Failed to calculate correlations:', error);
        } finally {
          setLoading(false);
        }
      };
      loadCorrelationData();
    }
  }, [stocks, timeInterval]);

  const handleTimeIntervalChange = (interval) => {
    setTimeInterval(interval);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Heatmap
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TimeIntervalSelector 
          selectedInterval={timeInterval} 
          onIntervalChange={handleTimeIntervalChange} 
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        correlationData && (
          <CorrelationHeatmap 
            data={correlationData} 
            stocks={stocks} 
          />
        )
      )}
    </Box>
  );
};

export default CorrelationPage;