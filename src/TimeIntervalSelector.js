import React from 'react';
import { ButtonGroup, Button } from '@mui/material';

const TimeIntervalSelector = ({ selectedInterval, onIntervalChange }) => {
  const intervals = [15, 30, 60, 120, 240];
  
  return (
    <ButtonGroup variant="contained" size="small">
      {intervals.map((interval) => (
        <Button
          key={interval}
          variant={selectedInterval === interval ? 'contained' : 'outlined'}
          onClick={() => onIntervalChange(interval)}
        >
          {interval} min
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default TimeIntervalSelector;