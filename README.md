Built for SWTS — Tick #847

# Delta Exchange Real-time Market Data Visualization

A full-stack application that streams live market data from Delta Exchange and visualizes it in real-time using Flask (backend) and React (frontend).

## Features

- **Real-time Data Streaming**: Connects to Delta Exchange WebSocket API for live market data
- **BTCUSD Focus**: Supports BTCUSD perpetual contracts (limited by Delta Exchange's 1 symbol subscription for orderbook)
- **Interactive Visualizations**: 
  - Real-time charts
  - Live order book ladder
  - Rolling trade tape
  - Derived metrics (VWAP, price changes)
- **SWTS Theme**: Uses SWTS teal color (#00897B) throughout the interface
- **Special Features**: "Bitcoin Heartbeat" title for BTCUSD instrument
- **Responsive Design**: Optimized for traders to read at a glance

## Architecture

```
├── backend/                 # Flask + Socket.IO backend
│   ├── app.py              # Main Flask application
│   ├── delta_client.py     # Delta Exchange WebSocket client
│   ├── config.py           # Configuration settings
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── App.js         # Main application
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables (optional, uses defaults if not provided):
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Start the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. View real-time market data for BTCUSD including:
   - Live charts
   - Order book with bid/ask levels
   - Recent trades tape
   - Market metrics (VWAP,  price changes)

## Data Sources

- **WebSocket Endpoint**: `wss://public-socket.india.delta.exchange`
- **Subscribed Channels**: `ticker`, `trades`, `ob_l2`
- **Supported Symbols**: `BTCUSD` (limited by Delta Exchange's 1 symbol constraint for orderbook)

## Derived Metrics

The application calculates and displays several derived metrics in real-time:

- **1-Minute VWAP**: Volume Weighted Average Price over the last minute
- **24h Price Change**: Percentage change from 24h open price

## Error Handling & Reliability

- **Automatic Reconnection**: WebSocket client automatically reconnects with exponential backoff
- **Sequence Validation**: Handles data sequence gaps and stale ticks
- **Connection Monitoring**: Real-time connection status indicator
- **Graceful Degradation**: UI shows appropriate messages when data is unavailable

## SWTS Specific Features

1.  **Fingerprint**: README starts with "Built for SWTS — Tick #847"
2.  **Accent Color**: SWTS teal (#00897B) used throughout the interface
3.  **Bitcoin Heartbeat**: Special title for BTCUSD instrument
4.  **Tooltip**: Contains "May the spread be tight" text
5.  **Git Commit**: At least one commit with "feat(socket):" prefix

## Development

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Frontend build
cd frontend
npm run build
```

## Environment Variables
Added as well in the project files to make it easier to run the application by the evaluator.
### Backend (.env)
```
DELTA_WS_URL=wss://public-socket.india.delta.exchange
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

### Frontend
The frontend proxies requests to the backend at `http://localhost:5000` by default.

## Trade-offs

### WebSocket vs REST Polling
- **Chosen**: WebSocket for real-time data
- **Trade-off**: More complex connection management but provides true real-time updates
- **Alternative**: REST polling would be simpler but would miss rapid price movements

### Chart Library Selection
- **Chosen**: Lightweight Charts for performance
- **Trade-off**: Less feature-rich than alternatives but better for real-time updates
- **Alternative**: Chart.js would offer more features but with potential performance overhead

### Chart Type Selection
- **Chosen**: Line chart to represent the "continuous heartbeat" of Bitcoin price movements
- **Trade-off**: Less detailed than candlestick charts but better for showing overall trends and relates to the "Bitcoin Heartbeat" theme
- **Alternative**: Candlestick charts would show more price detail but wouldn't match the heartbeat metaphor

### Data Processing
- **Chosen**: Client-side metric calculations
- **Trade-off**: Increases client complexity but reduces server load
- **Alternative**: Server-side calculations would be more centralized but increase server processing

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check internet connection
   - Verify Delta Exchange services are operational
   - Check firewall settings

2. **Frontend Not Loading**
   - Ensure backend is running on port 5000
   - Check Node.js and npm versions
   - Clear browser cache

3. **Data Not Updating**
   - Verify WebSocket subscription
   - Check browser console for errors
   - Ensure symbol selection is correct

### Logs

- **Backend**: Check terminal output for Flask server logs
- **Frontend**: Open browser developer console for JavaScript logs

## Performance Considerations

- **Data Throttling**: Limits trade tape to last 100 trades
- **Chart Updates**: Optimized for real-time performance
- **Memory Management**: Automatic cleanup of old data
- **Network Efficiency**: Binary WebSocket protocol for minimal overhead

## Security Notes

- No API keys required for public market data
- CORS enabled for development
- No sensitive data stored in client-side code
- WebSocket connections use secure (wss://) protocol

## License

This project is for evaluation purposes only. All rights reserved by the author.

## Support

For issues or questions regarding this evaluation project, please refer to the submission guidelines provided by SWTS.

## Demo Video:
[Watch Demo](https://www.loom.com/share/299ecedfe5ba454e8c5c7d137a38844d)

## Submitted By:
Aryan Gupta
9991525380
aryangupta07075@gmail.com
