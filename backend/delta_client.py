import asyncio
import json
import logging
import websockets
from datetime import datetime
from typing import Dict, List, Optional
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DeltaExchangeClient:
    def __init__(self, socketio_server):
        self.socketio_server = socketio_server
        self.ws = None
        self.is_connected = False
        self.reconnect_attempts = 0
        self.subscription_message = {
            "type": "subscribe",
            "payload": {
                "channels": [
                    {"name": "ticker", "symbols": Config.SYMBOLS},
                    {"name": "trades", "symbols": Config.SYMBOLS},
                    {"name": "ob_l2", "symbols": Config.SYMBOLS}  # Only BTCUSD due to symbol limit
                ]
            }
        }
        
    async def connect(self):
        """Connect to Delta Exchange WebSocket"""
        while not self.is_connected and self.reconnect_attempts < Config.WS_MAX_RECONNECT_ATTEMPTS:
            try:
                logger.info(f"Connecting to Delta Exchange WebSocket (attempt {self.reconnect_attempts + 1})")
                self.ws = await websockets.connect(Config.DELTA_WS_URL)
                self.is_connected = True
                self.reconnect_attempts = 0
                
                # Send subscription message
                await self.ws.send(json.dumps(self.subscription_message))
                logger.info("Subscribed to Delta Exchange channels")
                
                # Start listening for messages
                await self.listen()
                
            except Exception as e:
                logger.error(f"Connection failed: {e}")
                self.is_connected = False
                self.reconnect_attempts += 1
                if self.reconnect_attempts < Config.WS_MAX_RECONNECT_ATTEMPTS:
                    await asyncio.sleep(Config.WS_RECONNECT_DELAY)
                else:
                    logger.error("Max reconnect attempts reached")
                    
    async def listen(self):
        """Listen for WebSocket messages"""
        try:
            async for message in self.ws:
                try:
                    data = json.loads(message)
                    await self.process_message(data)
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse message: {e}")
                except Exception as e:
                    logger.error(f"Error processing message: {e}")
                    
        except websockets.exceptions.ConnectionClosed:
            logger.warning("WebSocket connection closed")
            self.is_connected = False
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            self.is_connected = False
            
    async def process_message(self, data: Dict):
        """Process incoming WebSocket message"""
        try:
            message_type = data.get('type')
            
            if message_type == 'ticker':
                await self.handle_ticker(data)
            elif message_type == 'trades':
                await self.handle_trades(data)
            elif message_type == 'ob_l2':
                await self.handle_orderbook(data)
            elif message_type == 'subscriptions':
                logger.info(f"Subscription confirmation: {data}")
            else:
                logger.debug(f"Unhandled message type: {message_type}")
                
        except Exception as e:
            logger.error(f"Error processing message type {message_type}: {e}")
            
    async def handle_ticker(self, data: Dict):
        """Handle ticker data"""
        try:
            if 'd' in data and len(data['d']) > 0:
                ticker_data = data['d'][0]
                processed_data = {
                    'type': 'ticker',
                    'symbol': ticker_data.get('s'),
                    'mark_price': float(ticker_data.get('m', 0)),
                    'best_bid': float(ticker_data.get('q', [0, 0, 0, 0])[2]) if len(ticker_data.get('q', [])) > 2 else 0,
                    'best_ask': float(ticker_data.get('q', [0, 0, 0, 0])[0]) if len(ticker_data.get('q', [])) > 0 else 0,
                    'bid_size': float(ticker_data.get('q', [0, 0, 0, 0])[3]) if len(ticker_data.get('q', [])) > 3 else 0,
                    'ask_size': float(ticker_data.get('q', [0, 0, 0, 0])[1]) if len(ticker_data.get('q', [])) > 1 else 0,
                    'mark_change_24h': float(ticker_data.get('m24hc', 0)),
                    'ohlc': {
                        'open': float(ticker_data.get('ohlc', [0, 0, 0, 0])[0]) if len(ticker_data.get('ohlc', [])) > 0 else 0,
                        'high': float(ticker_data.get('ohlc', [0, 0, 0, 0])[1]) if len(ticker_data.get('ohlc', [])) > 1 else 0,
                        'low': float(ticker_data.get('ohlc', [0, 0, 0, 0])[2]) if len(ticker_data.get('ohlc', [])) > 2 else 0,
                        'close': float(ticker_data.get('ohlc', [0, 0, 0, 0])[3]) if len(ticker_data.get('ohlc', [])) > 3 else 0,
                    },
                    'timestamp': data.get('ts'),
                    'spot_price': float(data.get('sp', 0))
                }
                
                # Emit to Socket.IO clients
                self.socketio_server.emit('ticker', processed_data)
                
        except Exception as e:
            logger.error(f"Error handling ticker data: {e}")
            
    async def handle_trades(self, data: Dict):
        """Handle trade data"""
        try:
            processed_data = {
                'type': 'trade',
                'symbol': data.get('sy'),
                'price': float(data.get('p', 0)),
                'size': float(data.get('s', 0)),
                'side': 'buy' if data.get('r') == 't' else 'sell',  # taker = buy, maker = sell
                'timestamp': data.get('t'),
                'server_timestamp': data.get('ts')
            }
            
            # Emit to Socket.IO clients
            self.socketio_server.emit('trade', processed_data)
            
        except Exception as e:
            logger.error(f"Error handling trade data: {e}")
            
    async def handle_orderbook(self, data: Dict):
        """Handle orderbook data"""
        try:
            processed_data = {
                'type': 'orderbook',
                'symbol': data.get('sy'),
                'bids': [[float(price), float(size)] for price, size in data.get('b', [])],
                'asks': [[float(price), float(size)] for price, size in data.get('a', [])],
                'timestamp': data.get('ts'),
                'last_update_timestamp': data.get('lts')
            }
            
            # Emit to Socket.IO clients
            self.socketio_server.emit('orderbook', processed_data)
            
        except Exception as e:
            logger.error(f"Error handling orderbook data: {e}")
            
    async def disconnect(self):
        """Disconnect from WebSocket"""
        if self.ws:
            await self.ws.close()
        self.is_connected = False

def run_delta_client(socketio_server):
    """Run the Delta Exchange client in an async context"""
    client = DeltaExchangeClient(socketio_server)
    
    def run_client():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(client.connect())
        
    import threading
    thread = threading.Thread(target=run_client, daemon=True)
    thread.start()
    
    return client
