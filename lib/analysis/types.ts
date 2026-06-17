/**
 * Core types for the analysis tool
 */

export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal?: number;
  histogram?: number;
}

export interface TechnicalAnalysis {
  sma20: TechnicalIndicator;
  sma50: TechnicalIndicator;
  sma200: TechnicalIndicator;
  rsi: TechnicalIndicator;
  macd: TechnicalIndicator;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  trend: 'bullish' | 'bearish' | 'neutral';
}

export interface SupportResistance {
  support: number[];
  resistance: number[];
}

export interface Trade {
  id: string;
  entryTime: number;
  exitTime?: number;
  entryPrice: number;
  exitPrice?: number;
  type: 'CALL' | 'PUT';
  status: 'open' | 'closed' | 'cancelled';
  profitLoss: number;
  returnPercentage: number;
  contractType: string;
}

export interface PortfolioMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfitLoss: number;
  totalReturn: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

export interface RiskMetrics {
  volatility: number;
  maxDrawdown: number;
  maxDrawdownPercentage: number;
  sharpeRatio: number;
  sortinoRatio: number;
  riskRewardRatio: number;
  valueAtRisk: number;
}

export interface AssetAllocation {
  symbol: string;
  percentage: number;
  value: number;
}

export interface PortfolioAnalysis {
  metrics: PortfolioMetrics;
  riskMetrics: RiskMetrics;
  topProfitable: Trade[];
  recentTrades: Trade[];
  allocation: AssetAllocation[];
}

export interface MarketData {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  timestamp: number;
  change24h: number;
  changePercent24h: number;
}

export interface AnalysisState {
  technicalAnalysis?: TechnicalAnalysis;
  supportResistance?: SupportResistance;
  portfolioAnalysis?: PortfolioAnalysis;
  marketData?: MarketData[];
  loading: boolean;
  error?: string;
}
