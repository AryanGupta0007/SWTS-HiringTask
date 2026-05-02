import React from 'react';
import { useSocket } from './hooks/useSocket';
import Chart from './components/Chart';
import OrderBook from './components/OrderBook';
import TradeTape from './components/TradeTape';
import Metrics from './components/Metrics';
import './App.css';

function App() {
  const selectedSymbol = 'BTCUSD'; // Only BTCUSD due to Delta Exchange symbol limitations
  const { connected, data } = useSocket();

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>
            Delta Exchange Market Data
            <span className="status-indicator connected"></span>
          </h1>
          <div className="subtitle">
            Real-time market data visualization for {selectedSymbol}
          </div>
          
          <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
            Note: Only BTCUSD is available due to Delta Exchange's 1 symbol subscription limit for orderbook data
          </div>
        </header>

        <div className="dashboard">
          <div className="chart-section">
            <Chart tickerData={data.ticker} symbol={selectedSymbol} />
          </div>

          <div className="orderbook-section">
            <OrderBook orderbookData={data.orderbook} />
          </div>

          <div className="trade-tape-section">
            <TradeTape trades={data.trades} />
          </div>

          <div className="metrics-section">
            <Metrics tickerData={data.ticker} trades={data.trades} />
          </div>
        </div>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px', 
          borderTop: '1px solid #333',
          color: '#666'
        }}>
          <p>Connection Status: {connected ? 'Connected' : 'Disconnected'}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
            <span className="tooltip">
              Built for SWTS — Tick #847
              <span className="tooltiptext">May the spread be tight</span>
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
