'use client';

import React, { useState } from 'react';
import { useConfig } from '@/lib/config-context';
import { Plus, X } from 'lucide-react';
import { PageHeader } from './PageHeader';

export function SettingsView() {
  const { 
    plans, origins, fields, 
    addPlan, removePlan, addOrigin, removeOrigin, 
    addField, removeField 
  } = useConfig();
  const [newPlan, setNewPlan] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newFieldName, setNewFieldName] = useState('');

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="Configurações" showSearch={false} />

      <main className="p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Fields Management */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold">Campos do Cadastro</h2>
            <p className="text-sm text-slate-500">Adicione ou remova campos que aparecem ao cadastrar novos clientes.</p>
          </div>

          <div className="flex gap-3">
            <input 
              type="text" 
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Nome do novo campo..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button 
              onClick={() => {
                if (newFieldName) {
                  addField({ 
                    id: newFieldName.toLowerCase().replace(/\s/g, '_'), 
                    label: newFieldName, 
                    type: 'text',
                    placeholder: `Digite ${newFieldName.toLowerCase()}...`
                  });
                  setNewFieldName('');
                }
              }}
              className="px-4 py-2 bg-primary-container text-white rounded-lg font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar Campo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                <span className="text-sm font-medium">{field.label} <span className="text-[10px] text-slate-400">({field.id})</span></span>
                <button 
                  onClick={() => removeField(field.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold">Gerenciar Planos</h2>
            <p className="text-sm text-slate-500">Adicione ou remova opções de planos para seus clientes.</p>
          </div>

          <div className="flex gap-3">
            <input 
              type="text" 
              value={newPlan}
              onChange={(e) => setNewPlan(e.target.value)}
              placeholder="Novo plano..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addPlan(newPlan);
                  setNewPlan('');
                }
              }}
            />
            <button 
              onClick={() => {
                addPlan(newPlan);
                setNewPlan('');
              }}
              className="px-4 py-2 bg-primary-container text-white rounded-lg font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plans.map((plan) => (
              <div key={plan} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                <span className="text-sm font-medium">{plan}</span>
                <button 
                  onClick={() => removePlan(plan)}
                  className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold">Gerenciar Origens</h2>
            <p className="text-sm text-slate-500">Adicione ou remova canais de origem de contato.</p>
          </div>

          <div className="flex gap-3">
            <input 
              type="text" 
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
              placeholder="Nova origem..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addOrigin(newOrigin);
                  setNewOrigin('');
                }
              }}
            />
            <button 
              onClick={() => {
                addOrigin(newOrigin);
                setNewOrigin('');
              }}
              className="px-4 py-2 bg-primary-container text-white rounded-lg font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {origins.map((origin) => (
              <div key={origin} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                <span className="text-sm font-medium">{origin}</span>
                <button 
                  onClick={() => removeOrigin(origin)}
                  className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
