'use client';

import { useState, useMemo } from 'react';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import { Header } from '@/components/custom/header';
import { Footer } from '@/components/custom/footer';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { PriceData, Trade } from '@/lib/analysis/types';

// Mock data for demonstration
const MOCK_PRICE_DATA: PriceData[] = Array.from({ length: 100 }, (_, i) => ({
  timestamp: Math.floor(Date.now() / 1000) - (100 - i) * 3600,
  open: 100 + Math.random() * 10 - 5,
  high: 105 + Math.random() * 10 - 5,
  low: 95 + Math.random() * 10 - 5,
  close: 100 + Math.random() * 10 - 5,
  volume: Math.floor(Math.random() * 10000),
}));

const MOCK_TRADES: Trade[] = [
  {
    id: '1',
    entryTime: Math.floor(Date.now() / 1000) - 86400,
    exitTime: Math.floor(Date.now() / 1000) - 82400,
    entryPrice: 100,
    exitPrice: 105,
    type: 'CALL',
    status: 'closed',
    profitLoss: 250,
    returnPercentage: 5.0,
    contractType: 'Rise',
  },
  {
    id: '2',
    entryTime: Math.floor(Date.now() / 1000) - 72000,
    exitTime: Math.floor(Date.now() / 1000) - 68000,
    entryPrice: 102,
    exitPrice: 99,
    type: 'PUT',
    status: 'closed',
    profitLoss: -150,
    returnPercentage: -2.94,
    contractType: 'Fall',
  },
  {
    id: '3',
    entryTime: Math.floor(Date.now() / 1000) - 54000,
    exitTime: Math.floor(Date.now() / 1000) - 50000,
    entryPrice: 101,
    exitPrice: 107,
    type: 'CALL',
    status: 'closed',
    profitLoss: 300,
    returnPercentage: 5.94,
    contractType: 'Rise',
  },
  {
    id: '4',
    entryTime: Math.floor(Date.now() / 1000) - 36000,
    exitTime: Math.floor(Date.now() / 1000) - 32000,
    entryPrice: 106,
    exitPrice: 103,
    type: 'PUT',
    status: 'closed',
    profitLoss: 150,
    returnPercentage: 2.83,
    contractType: 'Fall',
  },
  {
    id: '5',
    entryTime: Math.floor(Date.now() / 1000) - 18000,
    exitTime: Math.floor(Date.now() / 1000) - 14000,
    entryPrice: 103,
    exitPrice: 98,
    type: 'PUT',
    status: 'closed',
    profitLoss: -200,
    returnPercentage: -3.88,
    contractType: 'Fall',
  },
  {
    id: '6',
    entryTime: Math.floor(Date.now() / 1000) - 7200,
    exitTime: Math.floor(Date.now() / 1000) - 3600,
    entryPrice: 100,
    exitPrice: 109,
    type: 'CALL',
    status: 'closed',
    profitLoss: 450,
    returnPercentage: 9.0,
    contractType: 'Rise',
  },
];

export default function AnalysisPage() {
  const logoSrc = useLogoSrc();
  const { ws, isConnected, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;
  const [isLoading] = useState(false);

  const analysisData = useMemo(() => {
    // In a real app, you would fetch this from your trading data
    // For now, using mock data
    return {
      priceData: MOCK_PRICE_DATA,
      trades: MOCK_TRADES,
      accountBalance: 10000,
    };
  }, []);

  return (
    <main className="flex flex-col bg-background min-h-dvh">
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={login}
        onSignUp={signUp}
        onLogout={logout}
        onSwitchAccount={switchAccount}
        logoSrc={logoSrc}
        appName="Trading Analysis"
        actions={<ThemeToggle />}
      />

      {/* Spacer for fixed header */}
      <div className={authState === 'authenticated' ? 'h-[76px] shrink-0' : 'h-[66px] shrink-0'} />

      {/* Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6">
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <AnalysisDashboard
            priceData={analysisData.priceData}
            trades={analysisData.trades}
            accountBalance={analysisData.accountBalance}
          />
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm border-t border-border">
        <Footer />
      </div>
    </main>
  );
}
