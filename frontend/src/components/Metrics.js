import React, { useMemo } from 'react';

const Metrics = ({ tickerData, trades }) => {
  const metrics = useMemo(() => {
    if (!tickerData) {
      return {
        vwap: 0,
        spread: 0,
        priceChange: 0,
        priceChangePercent: 0,
        volume: 0
      };
    }

    // Calculate bid-ask spread
    const spread = tickerData.best_ask && tickerData.best_bid 
      ? tickerData.best_ask - tickerData.best_bid 
      : 0;

    // Calculate price change
    const priceChange = tickerData.mark_price && tickerData.ohlc?.open
      ? tickerData.mark_price - tickerData.ohlc.open
      : 0;

    const priceChangePercent = tickerData.ohlc?.open && tickerData.ohlc.open > 0
      ? (priceChange / tickerData.ohlc.open) * 100
      : 0;

    // Calculate rolling 1-minute VWAP from recent trades
    let vwap = 0;
    let totalVolume = 0;
    let totalValue = 0;

    if (trades && trades.length > 0) {
      const oneMinuteAgo = Date.now() - 60000; // 1 minute ago
      const recentTrades = trades.filter(trade => 
        trade.timestamp && (trade.timestamp / 1000000) > oneMinuteAgo
      );

      recentTrades.forEach(trade => {
        totalVolume += trade.size || 0;
        totalValue += (trade.price || 0) * (trade.size || 0);
      });

      vwap = totalVolume > 0 ? totalValue / totalVolume : tickerData.mark_price || 0;
    }

    return {
      vwap,
      spread,
      priceChange,
      priceChangePercent,
      volume: totalVolume
    };
  }, [tickerData, trades]);

  const formatNumber = (num, decimals = 2) => {
    return num.toFixed(decimals);
  };

  const formatPercent = (num) => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${formatNumber(num, 2)}%`;
  };

  if (!tickerData) {
    return (
      <div className="metrics-container">
        <h3 className="section-title">Market Metrics</h3>
        <div style={{ textAlign: 'center', color: '#888' }}>Waiting for market data...</div>
      </div>
    );
  }

  return (
    <div className="metrics-container">
      <h3 className="section-title">Market Metrics</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-label">1-Min VWAP</div>
          <div className="metric-value">
            ${formatNumber(metrics.vwap)}
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label">24h Change</div>
          <div className={`metric-value ${metrics.priceChange >= 0 ? 'positive' : 'negative'}`}>
            {formatPercent(metrics.priceChangePercent)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
