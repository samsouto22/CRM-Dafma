'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  TrendingDown, 
  Wallet,
  TrendingUp,
  Calendar,
  Download,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { useConfig } from '@/lib/config-context';
import { PageHeader } from './PageHeader';

export function Dashboard() {
  const { clients } = useConfig();

  // Calculate real metrics
  const activeClients = clients.filter(c => c.status === 'Ativo');
  
  const monthlyRevenue = activeClients.reduce((acc, client) => {
    // Remove "R$ " and replace "." with "" and "," with "." to parse as float
    const cleanValue = client.monthly.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return acc + (parseFloat(cleanValue) || 0);
  }, 0);

  const formattedRevenue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyRevenue);

  // Calculate annual accumulation (sum of totalPaid from all clients)
  const totalAccumulated = clients.reduce((acc, client) => {
    // totalPaid is a string like "R$ 18.000,00"
    const cleanValue = client.totalPaid?.replace('R$ ', '').replace(/\./g, '').replace(',', '.') || '0';
    return acc + (parseFloat(cleanValue) || 0);
  }, 0);
  const formattedAccumulated = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalAccumulated);

  // Calculate Churn (static for now as we don't have historical churn data in context yet)
  const churnRate = "0.0%";

  // Breakdown by origin
  const originCounts: Record<string, number> = {};
  clients.forEach(c => {
    originCounts[c.origin] = (originCounts[c.origin] || 0) + 1;
  });

  const totalClients = clients.length || 1;
  const originsBreakdown = Object.entries(originCounts).map(([name, count]) => ({
    name,
    value: Math.round((count / totalClients) * 100),
    color: name === 'Meta Ads' ? '#1877f2' : name === 'Google Ads' ? '#ea4335' : name === 'Indicação' ? '#10b981' : '#64748b'
  })).sort((a, b) => b.value - a.value).slice(0, 4);

  // Recent Conversions (last 4 clients)
  const recentClients = [...clients].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 4);

  // Chart data (simulated based on growth for now)
  const chartData = [
    { name: 'JAN', value: monthlyRevenue * 0.8 },
    { name: 'FEV', value: monthlyRevenue * 0.85 },
    { name: 'MAR', value: monthlyRevenue * 0.9 },
    { name: 'ABR', value: monthlyRevenue * 0.95 },
    { name: 'MAI', value: monthlyRevenue },
    { name: 'JUN', value: monthlyRevenue },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader />

      {/* Content */}
      <main className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Visão Geral</h1>
            <p className="text-on-surface-variant mt-1">Acompanhe as principais métricas de desempenho da sua agência.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
              <Calendar size={18} />
              Este Mês
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
              <Download size={18} />
              Exportar
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="RECEITA MENSAL" 
            value={formattedRevenue} 
            change="+5.2%" 
            trend="up" 
            subText="este mês" 
            icon={DollarSign}
            iconColor="text-primary-container"
            iconBg="bg-orange-50"
          />
          <KPICard 
            title="Clientes Ativos" 
            value={activeClients.length.toString()} 
            change={`+${clients.length - activeClients.length > 0 ? clients.length - activeClients.length : 0}`} 
            trend="up" 
            subText="total na base" 
            icon={Users}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <KPICard 
            title="Taxa de Churn" 
            value={churnRate} 
            change="0%" 
            trend="down" 
            subText="vs mês anterior" 
            icon={TrendingDown}
            iconColor="text-red-600"
            iconBg="bg-red-50"
          />
          <KPICard 
            title="ACÚMULO ANUAL" 
            value={formattedAccumulated} 
            subText="Recebido desde o início do ano" 
            icon={Wallet}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
        </div>

        {/* Charts & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Faturamento Mensal</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-container rounded-sm" />
                <span className="text-xs font-medium text-slate-500">Receita</span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 500, fill: '#64748B' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 500, fill: '#64748B' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9', opacity: 0.4 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#010521' : '#ff6600'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-8">Origem dos Clientes</h3>
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {originsBreakdown.length > 0 ? originsBreakdown.map((origin) => (
                <div key={origin.name}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: origin.color }} />
                      {origin.name}
                    </div>
                    <span className="font-bold">{origin.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${origin.value}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-2 rounded-full" 
                      style={{ backgroundColor: origin.color }} 
                    />
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 py-10">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold">Conversões Recentes</h3>
            <button className="text-primary-container text-sm font-bold hover:underline">Ver Tudo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fonte</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentClients.length > 0 ? recentClients.map((conv, i) => (
                  <tr key={conv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary group-hover:block hidden" />
                      <span className="text-sm font-semibold">{conv.company}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-mono">{conv.monthly}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{conv.origin}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        conv.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {conv.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400">Nenhum cliente cadastrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

interface KPIProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  subTextText?: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  subText: string;
}

function KPICard({ title, value, change, trend, icon: Icon, iconColor, iconBg, subText }: KPIProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between h-[150px] card-elevation-2"
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {change && (
            <div className={`flex items-center text-[11px] font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </div>
          )}
          <span className="text-[11px] text-slate-400 font-medium ml-1">{subText}</span>
        </div>
      </div>
    </motion.div>
  );
}
