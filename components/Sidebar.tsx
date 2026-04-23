'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Settings as SettingsIcon, 
  LogOut, 
  PlusCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type View = 'dashboard' | 'clients' | 'settings' | 'tasks';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients' as View, label: 'Gestão de Clientes', icon: Users },
    { id: 'tasks' as View, label: 'Tarefas', icon: CheckSquare },
  ];

  return (
    <nav className="fixed inset-y-0 left-0 w-64 bg-[#010521] text-white flex flex-col hidden md:flex z-50">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">DAFMA Agency</h1>
        <p className="text-slate-400 text-xs mt-1">Marketing CRM</p>
      </div>

      <ul className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                currentView === item.id 
                  ? "bg-orange-600/10 text-orange-500 border-l-4 border-orange-600" 
                  : "text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
              )}
            >
              <item.icon size={20} className={cn(currentView === item.id ? "text-orange-500" : "group-hover:text-white")} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="p-3 mt-auto border-t border-slate-800">
        <ul className="space-y-1">
          <li>
            <button 
              onClick={() => onViewChange('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                currentView === 'settings' ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <SettingsIcon size={20} />
              <span className="text-sm font-medium">Configurações</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <LogOut size={20} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
