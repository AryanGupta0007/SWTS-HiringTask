import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const Chart = ({ tickerData, symbol }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#111' },
        textColor: '#fff',
      },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#333',
        textColor: '#fff',
      },
      timeScale: {
        borderColor: '#333',
        textColor: '#fff',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add line series
    const lineSeries = chart.addLineSeries({
      color: '#00897B', // SWTS teal color
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !tickerData) return;

    // Convert ticker data to line chart format
    const price = tickerData.mark_price;
    if (!price) return;

    const lineData = {
      time: Math.floor(tickerData.timestamp / 1000000), // Convert microseconds to seconds
      value: price,
    };

    // Update the chart with new data
    seriesRef.current.update(lineData);
  }, [tickerData]);

  const getChartTitle = () => {
    if (symbol === 'BTCUSD') {
      return 'Bitcoin Heartbeat';
    }
    return `${symbol} Live Chart`;
  };

  return (
    <div className="chart-container">
      <h2 className="section-title">
        {getChartTitle()}
        <span className="tooltip">
          ℹ️
          <span className="tooltiptext">May the spread be tight</span>
        </span>
      </h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px', fontStyle: 'italic' }}>
        Line chart visualization to represent the continuous heartbeat of Bitcoin price movements
      </p>
      <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default Chart;
