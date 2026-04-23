'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Users, 
  ArrowRight,
  TrendingUp,
  X,
  Bell,
  Settings,
  Mail,
  MoreHorizontal,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useConfig } from '@/lib/config-context';
import { PageHeader } from './PageHeader';

const initialClientsData = [
  { 
    id: 1,
    company: 'Terraza Hostel', 
    avatar: 'T', 
    avatarBg: 'bg-orange-100 text-orange-700',
    responsible: 'João Silva', 
    plan: 'Aceleração Total', 
    monthly: 'R$ 1.500,00', 
    origin: 'Indicação',
    status: 'Ativo',
    startDate: '2023-05-15',
    totalPaid: 'R$ 18.000,00'
  },
  { 
    id: 2,
    company: 'Rotta Scooter', 
    avatar: 'R', 
    avatarBg: 'bg-blue-100 text-blue-700',
    responsible: 'Maria Oliveira', 
    plan: 'Google Performance', 
    monthly: 'R$ 2.200,00', 
    origin: 'Google Ads',
    status: 'Ativo',
    startDate: '2023-11-01',
    totalPaid: 'R$ 11.000,00'
  },
];

export function ClientManagement() {
  const { plans, origins, fields, clients, loading } = useConfig();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = clients.filter(c => 
    activeTab === 'active' ? c.status === 'Ativo' : c.status === 'Inativo'
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader />

      <main className="p-8 space-y-8 max-w-[1500px] mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Gestão de Clientes</h1>
            <p className="text-on-surface-variant mt-1">Gerencie e acompanhe seus clientes ativos e inativos.</p>
          </div>
          <button 
            onClick={() => {
              setSelectedClient(null);
              setShowForm(true);
            }}
            className="bg-primary-container hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-[0px_4px_12px_rgba(255,102,0,0.2)]"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 h-full">
          {/* Main List */}
          <div className="xl:col-span-4 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar clientes..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setActiveTab('active')}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-colors",
                    activeTab === 'active' ? "bg-slate-100 text-on-surface" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  Ativos
                </button>
                <button 
                  onClick={() => setActiveTab('inactive')}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-colors",
                    activeTab === 'inactive' ? "bg-slate-100 text-on-surface" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  Inativos
                </button>
                <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Empresa</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider text-center">Responsável</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider text-center">Clientes Desde</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Plano</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider text-right">Mensalidade</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Origem</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider text-center">Status</th>
                      <th className="px-5 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClients.map((client) => (
                      <tr 
                        key={client.id} 
                        onClick={() => {
                          setSelectedClient(client);
                          setShowForm(false);
                        }}
                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded flex items-center justify-center font-bold text-sm", client.avatarBg)}>
                              {client.avatar}
                            </div>
                            <span className="font-semibold text-sm whitespace-nowrap">{client.company}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 font-medium text-center">{client.responsible}</td>
                        <td className="px-5 py-4 text-sm text-slate-500 font-medium text-center">
                          <div className="flex items-center justify-center gap-2">
                             <Calendar size={14} className="text-slate-400" />
                             {new Date(client.startDate).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {(() => {
                            const plan = client.plan;
                            let colors = "bg-slate-100 text-slate-800";
                            if (plan === 'Google Performance') colors = "bg-green-100 text-[#0F9D58]";
                            else if (plan === 'Meta Performance') colors = "bg-blue-100 text-[#1877F2]";
                            else if (plan === 'Presença Total') colors = "bg-orange-100 text-[#FF6600]";
                            else if (plan === 'Aceleração Total') colors = "bg-purple-100 text-[#673AB7]";
                            
                            return (
                              <span className={cn(
                                "px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap",
                                colors
                              )}>
                                {plan}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-5 py-4 text-sm text-on-surface font-mono text-right font-bold">{client.monthly}</td>
                        <td className="px-5 py-4 text-sm text-slate-500 font-medium">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {client.origin === 'Indicação' ? <Users size={14} className="text-slate-400" /> : <TrendingUp size={14} className="text-slate-400" />}
                            {client.origin}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase",
                            client.status === 'Ativo' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          )}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Panel / Form */}
          <div className="xl:col-span-1">
             <AnimatePresence mode="wait">
                {showForm ? (
                  <ClientForm 
                    initialData={selectedClient} 
                    onClose={() => {
                      setShowForm(false);
                      setSelectedClient(null);
                    }} 
                  />
                ) : selectedClient ? (
                  <ClientDetail 
                    client={selectedClient} 
                    fields={fields} 
                    onClose={() => setSelectedClient(null)}
                    onEdit={() => setShowForm(true)}
                  />
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 h-full flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <Plus size={32} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Selecione um cliente</h3>
                      <p className="text-sm text-slate-500 max-w-[200px]">Visualize detalhes ou adicione um novo para começar.</p>
                    </div>
                  </div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function ClientForm({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
  const { plans, origins, fields, addClient, updateClient } = useConfig();
  const [formData, setFormData] = useState<any>(initialData || {
    status: 'Ativo',
    plan: plans[0] || 'Selecione...',
    origin: origins[0] || 'Selecione...',
    avatarBg: 'bg-orange-100 text-orange-700'
  });

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const clientData = {
      ...formData,
      avatar: (formData.company || formData.responsible || '?').charAt(0).toUpperCase(),
      monthly: formData.monthly?.toString().startsWith('R$') 
        ? formData.monthly 
        : formData.monthly ? `R$ ${parseFloat(formData.monthly).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
      plan: formData.plan === 'Selecione...' ? '' : formData.plan,
      origin: formData.origin === 'Selecione...' ? '' : formData.origin,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      totalPaid: formData.totalPaid || 'R$ 0,00'
    };

    if (initialData) {
      updateClient({ ...clientData, id: initialData.id });
    } else {
      addClient(clientData);
    }
    onClose();
  };

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-6 h-full flex flex-col shadow-lg"
    >
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
        <h3 className="font-bold text-lg">{initialData ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => {
          let val = formData[field.id] || '';
          // If it's a number field and starts with R$, strip it for the input if editing
          if (field.id === 'monthly' && val.toString().startsWith('R$')) {
             val = val.replace(/[^\d.,]/g, '').replace(',', '.');
          }
          
          return (
            <div key={field.id}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">{field.label}</label>
              <input 
                type={field.type}
                placeholder={field.placeholder}
                value={val}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              />
            </div>
          );
        })}
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Plano</label>
          <select 
            value={formData.plan}
            onChange={(e) => handleInputChange('plan', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option>Selecione...</option>
            {plans.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Origem</label>
          <select 
            value={formData.origin}
            onChange={(e) => handleInputChange('origin', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option>Selecione...</option>
            {origins.map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 mt-4">
          <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{formData.status}</span>
            <div 
              onClick={() => handleInputChange('status', formData.status === 'Ativo' ? 'Inativo' : 'Ativo')}
              className={cn(
                "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                formData.status === 'Ativo' ? "bg-primary-container" : "bg-slate-300"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                formData.status === 'Ativo' ? "right-1" : "left-1"
              )} />
            </div>
          </div>
        </div>
      </form>

      <div className="pt-6 border-t border-slate-100 flex gap-3 mt-auto">
        <button 
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-secondary text-secondary rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-primary-container text-white rounded-lg font-bold text-sm hover:bg-orange-500 transition-all"
        >
          Salvar
        </button>
      </div>
    </motion.div>
  );
}

function ClientDetail({ client, fields, onClose, onEdit }: { client: any, fields: any[], onClose: () => void, onEdit: () => void }) {
  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-6 h-full flex flex-col shadow-lg"
    >
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
        <h3 className="font-bold text-lg">Detalhes do Cliente</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar text-sm">
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
           <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center font-bold text-xl", client.avatarBg)}>
              {client.avatar}
           </div>
           <div>
             <div className="font-bold text-base">{client.company}</div>
             <div className="text-slate-500">{client.responsible}</div>
           </div>
        </div>

        <div className="space-y-4">
          <DetailItem label="Plano" value={client.plan} />
          <DetailItem label="Origem" value={client.origin} />
          <DetailItem label="Status" value={client.status} isStatus />
          
          {fields.map(field => {
            // Already handled company and responsible in header roughly, 
            // but let's show everything explicitly for clarity
            let val = client[field.id];
            if (field.type === 'date' && val) {
              val = new Date(val).toLocaleDateString('pt-BR');
            }
            return <DetailItem key={field.id} label={field.label} value={val} />;
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 mt-auto flex gap-3">
        <button 
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-primary-container text-white rounded-lg font-bold text-sm hover:bg-orange-500 transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
        >
          Fechar
        </button>
      </div>
    </motion.div>
  );
}

function DetailItem({ label, value, isStatus }: { label: string, value: string, isStatus?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={cn(
        "font-medium",
        isStatus && (value === 'Ativo' ? "text-green-600" : "text-red-600")
      )}>
        {value}
      </div>
    </div>
  );
}
