import React from 'react';

const OrderBook = ({ orderbookData }) => {
  if (!orderbookData) {
    return (
      <div className="orderbook-container">
        <h3 className="section-title">Order Book</h3>
        <div style={{ textAlign: 'center', color: '#888' }}>Waiting for orderbook data...</div>
      </div>
    );
  }

  const { bids = [], asks = [], symbol } = orderbookData || { bids: [], asks: [], symbol: '' };

  // Combine bids and asks for display
  const maxLevels = 5;
  const displayBids = bids.slice(0, maxLevels);
  const displayAsks = asks.slice(0, maxLevels);

  // Calculate spread
  const spread = displayBids.length > 0 && displayAsks.length > 0 
    ? displayAsks[0][0] - displayBids[0][0] 
    : 0;

  return (
    <div className="orderbook-container">
      <h3 className="section-title">
        Order Book - {symbol}
        <span className="tooltip">
          ℹ️
          <span className="tooltiptext">May the spread be tight</span>
        </span>
      </h3>
      
      {spread > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#00897B' }}>
          Spread: {spread.toFixed(2)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Bids */}
        <div>
          <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>Bids</h4>
          <table className="orderbook-table">
            <thead>
              <tr>
                <th>Price</th>
                <th>Size</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {displayBids.map((bid, index) => (
                <tr key={`bid-${index}`} className="bid">
                  <td>{bid[0].toFixed(2)}</td>
                  <td>{bid[1].toFixed(1)}</td>
                  <td>{(bid[0] * bid[1]).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Asks */}
        <div>
          <h4 style={{ color: '#ff4444', marginBottom: '10px' }}>Asks</h4>
          <table className="orderbook-table">
            <thead>
              <tr>
                <th>Price</th>
                <th>Size</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {displayAsks.map((ask, index) => (
                <tr key={`ask-${index}`} className="ask">
                  <td>{ask[0].toFixed(2)}</td>
                  <td>{ask[1].toFixed(1)}</td>
                  <td>{(ask[0] * ask[1]).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
