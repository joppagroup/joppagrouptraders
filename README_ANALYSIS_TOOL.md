# Analysis Tool Documentation

## Overview

The Analysis Tool is a comprehensive suite of financial analysis components for the Deriv Rise/Fall Trading App. It provides technical analysis, portfolio analysis, risk analysis, and trade analytics.

## Features

### 1. Technical Analysis
- **Moving Averages**: SMA(20), SMA(50), SMA(200)
- **RSI (Relative Strength Index)**: 14-period momentum indicator
- **MACD**: Moving Average Convergence Divergence with signal line
- **Bollinger Bands**: Volatility and price levels
- **Trend Detection**: Bullish, Bearish, or Neutral
- **Support & Resistance**: Key price levels

### 2. Portfolio Analysis
- **Performance Metrics**:
  - Total trades, winning/losing trades
  - Win rate and profit factor
  - Average win/loss
  - Consecutive wins/losses

- **Charts**:
  - Win/Loss distribution pie chart
  - Asset allocation breakdown

- **Risk Metrics**:
  - Volatility (standard deviation)
  - Maximum drawdown
  - Sharpe Ratio & Sortino Ratio
  - Risk/Reward Ratio
  - Value at Risk (VaR)

### 3. Risk Analysis
- **Equity Curve**: Account balance over time
- **Drawdown Chart**: Peak-to-trough decline visualization
- **Risk Assessment**: Warnings based on volatility and drawdown
- **Risk Level Indicator**: Low, Medium, High, Very High

### 4. Trade Analytics
- **Trade Summary**: Total, winning, and losing trades
- **Hourly Distribution**: Trades by time of day
- **Contract Type Performance**: Analysis by CALL/PUT or other contract types
- **Recent Trades Table**: Detailed trade history

## File Structure

```
lib/analysis/
├── types.ts              # Core TypeScript interfaces
├── indicators.ts         # Technical indicator calculations
└── portfolio.ts          # Portfolio analysis functions

components/analysis/
├── TechnicalAnalysisPanel.tsx
├── PortfolioAnalysisPanel.tsx
├── RiskAnalysisPanel.tsx
├── TradeAnalyticsPanel.tsx
└── AnalysisDashboard.tsx  # Main dashboard component

hooks/
└── useAnalysis.ts        # React hook for analysis state
```

## Usage

### Basic Setup

```typescript
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import { PriceData, Trade } from '@/lib/analysis/types';

// Sample price data
const priceData: PriceData[] = [
  {
    timestamp: 1234567890,
    open: 100,
    high: 105,
    low: 98,
    close: 102,
    volume: 1000,
  },
  // ... more data
];

// Sample trades
const trades: Trade[] = [
  {
    id: '1',
    entryTime: 1234567890,
    exitTime: 1234567900,
    entryPrice: 100,
    exitPrice: 102,
    type: 'CALL',
    status: 'closed',
    profitLoss: 50,
    returnPercentage: 2.0,
    contractType: 'Rise',
  },
  // ... more trades
];

// Render dashboard
export function MyAnalytics() {
  return (
    <AnalysisDashboard 
      priceData={priceData} 
      trades={trades}
      accountBalance={10000}
    />
  );
}
```

### Individual Components

You can also use individual analysis components:

```typescript
import { TechnicalAnalysisPanel } from '@/components/analysis/TechnicalAnalysisPanel';

export function MyChart() {
  return <TechnicalAnalysisPanel priceData={priceData} />;
}
```

## Technical Indicators

### SMA (Simple Moving Average)
Calculates the average price over a specified period.
```typescript
const sma20 = calculateSMA(prices, 20);
```

### EMA (Exponential Moving Average)
Gives more weight to recent prices.
```typescript
const ema = calculateEMA(prices, 12);
```

### RSI (Relative Strength Index)
Measures momentum on a scale of 0-100.
- RSI > 70: Overbought (potential sell signal)
- RSI < 30: Oversold (potential buy signal)

### MACD
Shows relationship between two moving averages.
Returns:
- `macdLine`: MACD line value
- `signal`: Signal line (9-period EMA)
- `histogram`: Difference between MACD and signal

### Bollinger Bands
Shows upper, middle (SMA), and lower bands.
- Price above upper band: Potentially overbought
- Price below lower band: Potentially oversold

## Portfolio Metrics

### Win Rate
```
Win Rate = (Winning Trades / Total Trades) * 100
```

### Profit Factor
```
Profit Factor = Average Win / Average Loss
```
A ratio > 1.0 indicates profitable trading.

### Sharpe Ratio
```
Sharpe Ratio = Average Return / Return Volatility
```
Higher is better. Measures risk-adjusted returns.

### Sortino Ratio
Similar to Sharpe but only considers downside volatility.

### Maximum Drawdown
The largest peak-to-trough decline during a period.
```
Max Drawdown = (Peak Balance - Trough Balance) / Peak Balance * 100
```

## Data Types

### PriceData
```typescript
interface PriceData {
  timestamp: number;    // Unix timestamp
  open: number;         // Opening price
  high: number;         // Highest price
  low: number;          // Lowest price
  close: number;        // Closing price
  volume: number;       // Trading volume
}
```

### Trade
```typescript
interface Trade {
  id: string;
  entryTime: number;         // Unix timestamp
  exitTime?: number;
  entryPrice: number;
  exitPrice?: number;
  type: 'CALL' | 'PUT';
  status: 'open' | 'closed' | 'cancelled';
  profitLoss: number;        // Dollar amount
  returnPercentage: number;  // Percentage return
  contractType: string;      // e.g., 'Rise', 'Fall'
}
```

## Dependencies

The analysis tool uses:
- **React**: For UI components
- **Recharts**: For charts and visualizations
- **Radix UI**: For accessible UI components
- **Lucide React**: For icons
- **TypeScript**: For type safety

## Performance Considerations

- Use `useMemo` to prevent unnecessary recalculations
- Limit historical data to a reasonable window (e.g., last 1000 trades)
- Consider debouncing updates for real-time data
- Paginate trade tables for large datasets

## Extending the Tool

### Adding a New Indicator

1. Create the calculation function in `lib/analysis/indicators.ts`:
```typescript
export function calculateMyIndicator(prices: number[]): number {
  // Your calculation logic
}
```

2. Add it to the `TechnicalAnalysis` type in `lib/analysis/types.ts`

3. Update `TechnicalAnalysisPanel` to display the new indicator

## Best Practices

1. **Data Validation**: Always validate input data before analysis
2. **Error Handling**: Use try-catch blocks and display user-friendly errors
3. **Performance**: Memoize expensive calculations
4. **Accessibility**: Ensure charts have proper labels and legends
5. **Responsiveness**: Test on mobile and desktop views

## Troubleshooting

### NaN values in calculations
- Ensure price data has sufficient length for the calculation period
- Check for invalid price values (negative, zero, etc.)

### Charts not rendering
- Verify data format matches expected interfaces
- Check that Recharts is properly installed
- Ensure container has defined width and height

### Performance issues
- Reduce the amount of historical data
- Use larger time periods (e.g., hourly instead of tick data)
- Implement pagination for trade tables
