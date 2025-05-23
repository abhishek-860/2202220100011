export const calculateCorrelationMatrix = (allStockData, stockTickers) => {
  // Align data by timestamp and fill missing values
  const alignedData = alignStockData(allStockData, stockTickers);
  
  // Calculate correlation matrix
  const n = stockTickers.length;
  const matrix = Array(n).fill().map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1; // Correlation with itself is 1
      } else if (j > i) {
        const correlation = calculatePearsonCorrelation(
          alignedData.map(item => item[i].price),
          alignedData.map(item => item[j].price)
        );
        matrix[i][j] = correlation;
        matrix[j][i] = correlation; // Symmetric matrix
      }
    }
  }
  
  return matrix;
};

const alignStockData = (allStockData, stockTickers) => {
  // Find all unique timestamps
  const allTimestamps = new Set();
  allStockData.forEach(stockData => {
    stockData.forEach(item => {
      allTimestamps.add(item.lastUpdatedAt);
    });
  });
  
  const sortedTimestamps = Array.from(allTimestamps).sort();
  
  // Create aligned data structure
  return sortedTimestamps.map(timestamp => {
    return stockTickers.map((ticker, index) => {
      const stockData = allStockData[index];
      const dataPoint = stockData.find(item => item.lastUpdatedAt === timestamp);
      
      // If no data for this timestamp, use the previous value or 0
      if (!dataPoint) {
        const prevData = stockData
          .filter(item => item.lastUpdatedAt < timestamp)
          .sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))[0];
        return prevData || { price: 0, lastUpdatedAt: timestamp };
      }
      
      return dataPoint;
    });
  });
};

const calculatePearsonCorrelation = (x, y) => {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  
  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate covariance and standard deviations
  let covariance = 0;
  let stdDevX = 0;
  let stdDevY = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    
    covariance += diffX * diffY;
    stdDevX += diffX * diffX;
    stdDevY += diffY * diffY;
  }
  
  covariance /= (n - 1);
  stdDevX = Math.sqrt(stdDevX / (n - 1));
  stdDevY = Math.sqrt(stdDevY / (n - 1));
  
  // Calculate Pearson correlation coefficient
  return covariance / (stdDevX * stdDevY);
};