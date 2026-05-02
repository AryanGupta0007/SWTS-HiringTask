import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DELTA_WS_URL = os.getenv('DELTA_WS_URL', 'wss://public-socket.india.delta.exchange')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    PORT = int(os.getenv('PORT', 5000))
    
    # Delta Exchange symbols to subscribe to
    # Note: Only BTCUSD is used due to Delta Exchange's 1 symbol limit for orderbook channel
    SYMBOLS = ['BTCUSD']
    
    # Channels to subscribe to
    CHANNELS = ['v2/ticker', 'trades', 'ob_l2']
    
    # WebSocket settings
    WS_RECONNECT_DELAY = 5  # seconds
    WS_MAX_RECONNECT_ATTEMPTS = 10
