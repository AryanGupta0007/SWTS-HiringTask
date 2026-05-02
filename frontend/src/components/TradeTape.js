import React, { useEffect, useRef } from 'react';

const TradeTape = ({ trades }) => {
  const tapeRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to top when new trades come in
    if (tapeRef.current && trades.length > 0) {
      tapeRef.current.scrollTop = 0;
    }
  }, [trades]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp / 1000); // Convert microseconds to milliseconds
    return date.toLocaleTimeString();
  };

  if (!trades || trades.length === 0) {
    return (
      <div className="trade-tape-container">
        <h3 className="section-title">Recent Trades</h3>
        <div style={{ textAlign: 'center', color: '#888' }}>Waiting for trade data...</div>
      </div>
    );
  }

  return (
    <div className="trade-tape-container">
      <h3 className="section-title">Recent Trades</h3>
      <div className="trade-tape" ref={tapeRef}>
        {trades.map((trade, index) => (
          <div 
            key={`${trade.timestamp}-${index}`} 
            className={`trade-item ${trade.side}`}
          >
            <div className="trade-price">
              {trade.side === 'buy' ? '▲' : '▼'} {trade.price.toFixed(2)}
            </div>
            <div className="trade-size">{trade.size.toFixed(3)}</div>
            <div className="trade-time">{formatTime(trade.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeTape;
