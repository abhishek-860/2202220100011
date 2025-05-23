import axios from 'axios';

const API_BASE_URL = 'https://20.244.56.144/evaluation-service';

export const fetchStocks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks`);
    return response.data.stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

export const fetchStockData = async (ticker, minutes = null) => {
  try {
    const url = minutes 
      ? `${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}`
      : `${API_BASE_URL}/stocks/${ticker}`;
    
    const response = await axios.get(url);
    return Array.isArray(response.data) ? response.data : [response.data.stock];
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
};