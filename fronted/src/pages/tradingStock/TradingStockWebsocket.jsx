class MultiPriceTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prices: {}
    };
    this.socket = null;
    this.symbolToLabelMap = {
      AAPL: 'Apple Inc.',
      GOOGL: 'Alphabet Inc.',
      MSFT: 'Microsoft Corporation'
    };
  }

  componentDidMount() {
    this.socket = new WebSocket('wss://example.com/prices');
    this.socket.onmessage = this.handleMessage;
    this.subscribeToPrices(Object.keys(this.symbolToLabelMap));
  }

  componentWillUnmount() {
    this.unsubscribeFromPrices(Object.keys(this.symbolToLabelMap));
    this.socket.close();
  }

  handleMessage = event => {
    const data = JSON.parse(event.data);
    if (data.price && data.symbol) {
      this.setState(state => ({
        prices: {
          ...state.prices,
          [data.symbol]: data.price
        }
      }));
    }
  };

  subscribeToPrices = symbols => {
    symbols.forEach(symbol => {
      this.socket.send(JSON.stringify({
        type: 'subscribe',
        channel: symbol
      }));
    });
  };

  unsubscribeFromPrices = symbols => {
    symbols.forEach(symbol => {
      this.socket.send(JSON.stringify({
        type: 'unsubscribe',
        channel: symbol
      }));
    });
  };

  render() {
    const { prices } = this.state;
    return (
      <div>
        <h1>Multi-Price Tracker</h1>
        {Object.keys(prices).length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {Object.keys(prices).map(symbol => (
              <li key={symbol}>
                <strong>{this.symbolToLabelMap[symbol]}</strong>: {prices[symbol]}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
