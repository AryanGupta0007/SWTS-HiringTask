from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import logging
from delta_client import run_delta_client
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'delta-exchange-secret-key'

# Create Socket.IO server
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Start Delta Exchange client
delta_client = run_delta_client(socketio)

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/health')
def health():
    """Health check endpoint"""
    return {'status': 'healthy', 'delta_connected': delta_client.is_connected if delta_client else False}

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info(f'Client connected: {request.sid}')
    emit('status', {'message': 'Connected to Delta Exchange feed'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f'Client disconnected: {request.sid}')

@socketio.on('subscribe')
def handle_subscribe(data):
    """Handle subscription requests"""
    symbol = data.get('symbol', 'BTCUSD')
    logger.info(f'Client {request.sid} subscribed to {symbol}')
    emit('status', {'message': f'Subscribed to {symbol}'})

@socketio.on('unsubscribe')
def handle_unsubscribe(data):
    """Handle unsubscription requests"""
    symbol = data.get('symbol', 'BTCUSD')
    logger.info(f'Client {request.sid} unsubscribed from {symbol}')
    emit('status', {'message': f'Unsubscribed from {symbol}'})

if __name__ == '__main__':
    logger.info(f"Starting Flask server on port {Config.PORT}")
    socketio.run(app, host='0.0.0.0', port=Config.PORT, debug=Config.FLASK_DEBUG)
