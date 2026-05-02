import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState({
    ticker: null,
    trades: [],
    orderbook: null,
    metrics: null,
    currentSymbol: 'BTCUSD'
  });

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      upgrade: false
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socketInstance.on('ticker', (tickerData) => {
      setData(prev => ({ 
        ...prev, 
        ticker: tickerData 
      }));
    });

    socketInstance.on('trade', (tradeData) => {
      setData(prev => ({ 
        ...prev, 
        trades: [tradeData, ...prev.trades.slice(0, 99)] // Keep last 100 trades
      }));
    });

    socketInstance.on('orderbook', (orderbookData) => {
      setData(prev => ({ 
        ...prev, 
        orderbook: orderbookData 
      }));
    });

    socketInstance.on('status', (statusData) => {
      console.log('Status:', statusData);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribe = (symbol) => {
    if (socket) {
      socket.emit('subscribe', { symbol });
    }
  };

  const unsubscribe = (symbol) => {
    if (socket) {
      socket.emit('unsubscribe', { symbol });
    }
  };

  return {
    socket,
    connected,
    data,
    subscribe,
    unsubscribe
  };
};
