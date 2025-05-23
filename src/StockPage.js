import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { fetchStocks, fetchStockData } from '../api/stockApi';
import StockChart from '../components/StockChart';
import TimeIntervalSelector from '../components/TimeIntervalSelector';

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState('');
  const [stockData, setStockData] = useState([]);
  const [timeInterval, setTimeInterval] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocksData = await fetchStocks();
        setStocks(stocksData);
        setSelectedStock(Object.values(stocksData)[0]);
      } catch (error) {
        console.error('Failed to load stocks:', error);
      }
    };
    loadStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      const loadStockData = async () => {
        setLoading(true);
        try {
          const data = await fetchStockData(selectedStock, timeInterval);
          setStockData(data);
        } catch (error) {
          console.error('Failed to load stock data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadStockData();
    }
  }, [selectedStock, timeInterval]);

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const handleTimeIntervalChange = (interval) => {
    setTimeInterval(interval);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Analysis
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="stock-select-label">Select Stock</InputLabel>
          <Select
            labelId="stock-select-label"
            value={selectedStock}
            label="Select Stock"
            onChange={handleStockChange}
          >
            {Object.entries(stocks).map(([name, ticker]) => (
              <MenuItem key={ticker} value={ticker}>
                {name} ({ticker})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
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
        stockData.length > 0 && (
          <StockChart 
            data={stockData} 
            stockName={Object.keys(stocks).find(key => stocks[key] === selectedStock)} 
            stockTicker={selectedStock} 
          />
        )
      )}
    </Box>
  );
};

export default StockPage;