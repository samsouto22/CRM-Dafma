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
import { Sidebar, View } from '@/components/Sidebar';
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

export function Dashboard({ onViewChange }: { onViewChange: (view: View) => void }) {
  const { clients, tasks } = useConfig();

  const parseCurrency = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) || 0;
  };

  // Calculate real metrics
  const activeClients = clients.filter(c => c.status === 'Ativo');
  const today = new Date();
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-11
  
  // Receita Mensal: Only what was received so far this month
  const monthlyRevenue = activeClients.reduce((acc, client) => {
    const payDay = parseInt(client.payDay) || 1;
    if (currentDay >= payDay) {
      return acc + parseCurrency(client.monthly);
    }
    return acc;
  }, 0);

  const formattedRevenue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyRevenue);

  // Logic for Monthly Breakdown and Annual Accumulation
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  
  // Chart Data: Last 12 months
  const chartData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthIdx = d.getMonth();
    const year = d.getFullYear();
    
    const monthRevenue = clients.reduce((acc, client) => {
      if (client.status !== 'Ativo') return acc;
      
      const clientStartDate = new Date(client.startDate);
      if (isNaN(clientStartDate.getTime())) return acc;

      const startYear = clientStartDate.getFullYear();
      const startMonth = clientStartDate.getMonth();
      
      // If the month in loop is after the start month
      if (year > startYear || (year === startYear && monthIdx >= startMonth)) {
        // If it's the current month, only count if payday has passed
        if (year === currentYear && monthIdx === currentMonth) {
          const payDay = parseInt(client.payDay) || 1;
          if (currentDay >= payDay) {
            return acc + parseCurrency(client.monthly);
          }
          return acc;
        }
        // For past months, we assume received
        return acc + parseCurrency(client.monthly);
      }
      return acc;
    }, 0);
    
    chartData.push({ name: months[monthIdx], value: monthRevenue });
  }

  // Annual Accumulation: From Jan of current year to current month
  let totalAccumulated = 0;
  for (let m = 0; m <= currentMonth; m++) {
    totalAccumulated += clients.reduce((acc, client) => {
      if (client.status !== 'Ativo') return acc;
      
      const clientStartDate = new Date(client.startDate);
      if (isNaN(clientStartDate.getTime())) return acc;

      const startYear = clientStartDate.getFullYear();
      const startMonth = clientStartDate.getMonth();
      
      if (currentYear > startYear || (currentYear === startYear && m >= startMonth)) {
        // If it's the current month, only count if "payDay" has passed
        if (m === currentMonth) {
          const payDay = parseInt(client.payDay) || 1;
          if (currentDay >= payDay) {
            return acc + parseCurrency(client.monthly);
          }
          return acc;
        }
        // For past full months of the current year
        return acc + parseCurrency(client.monthly);
      }
      return acc;
    }, 0);
  }

  const formattedAccumulated = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalAccumulated);

  // Ticket Médio Logic
  const averageTicket = activeClients.length > 0 ? monthlyRevenue / activeClients.length : 0;
  const formattedTicket = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageTicket);

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

  // Next Tasks Logic
  const upcomingTasks = [...(tasks || [])]
    .filter(t => t.status === 'Pendente')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
            title="Ticket Médio" 
            value={formattedTicket} 
            icon={DollarSign}
            iconColor="text-primary-container"
            iconBg="bg-orange-50"
            subText="per cliente ativo" 
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
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#ff6600" />
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

        {/* Next Tasks */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold">Próximas Tarefas</h3>
            <button 
              onClick={() => onViewChange('tasks')}
              className="text-primary-container text-sm font-bold hover:underline"
            >
              Ver Tudo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tarefa</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingTasks.length > 0 ? upcomingTasks.map((task, i) => (
                  <tr 
                    key={task.id} 
                    onClick={() => onViewChange('tasks')}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary group-hover:block hidden" />
                      <span className="text-sm font-semibold">{task.description}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{task.clientName}</td>
                    <td className="py-4 px-6 text-sm text-slate-500 font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(task.date).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-slate-400">Nenhuma tarefa pendente</td>
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
