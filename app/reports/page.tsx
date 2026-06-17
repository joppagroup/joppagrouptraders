'use client';

import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { Header } from '@/components/custom/header';
import { Footer } from '@/components/custom/footer';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, TrendingUp, AlertTriangle, Activity, ArrowLeft } from 'lucide-react';

export default function ReportsPage() {
  const logoSrc = useLogoSrc();
  const { auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;

  const reports = [
    {
      id: 'analysis',
      title: 'Trading Analysis',
      description: 'Comprehensive technical analysis, portfolio metrics, and risk assessment',
      icon: BarChart3,
      href: '/analysis',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'technical',
      title: 'Technical Analysis',
      description: 'Moving averages, RSI, MACD, Bollinger Bands, and trend detection',
      icon: TrendingUp,
      href: '/analysis?tab=technical',
      color: 'bg-green-100 text-green-700',
    },
    {
      id: 'risk',
      title: 'Risk Analysis',
      description: 'Volatility, drawdown, Sharpe ratio, and Value at Risk metrics',
      icon: AlertTriangle,
      href: '/analysis?tab=risk',
      color: 'bg-red-100 text-red-700',
    },
    {
      id: 'analytics',
      title: 'Trade Analytics',
      description: 'Trade statistics, hourly distribution, and performance breakdown',
      icon: Activity,
      href: '/analysis?tab=analytics',
      color: 'bg-orange-100 text-orange-700',
    },
  ];

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
        appName="Reports"
        actions={<ThemeToggle />}
      />

      {/* Spacer for fixed header */}
      <div className={authState === 'authenticated' ? 'h-[76px] shrink-0' : 'h-[66px] shrink-0'} />

      {/* Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trading
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analysis tools for your trading performance
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => {
            const IconComponent = report.icon;
            return (
              <Link key={report.id} href={report.href}>
                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <div className={`p-2 rounded-lg ${report.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm border-t border-border">
        <Footer />
      </div>
    </main>
  );
}
