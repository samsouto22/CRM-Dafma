'use client';

import React from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { useConfig } from '@/lib/config-context';
import { motion, AnimatePresence } from 'motion/react';

interface PageHeaderProps {
  title?: string;
  showSearch?: boolean;
}

export function PageHeader({ title, showSearch = true }: PageHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
      {showSearch ? (
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      ) : (
        <div className="text-xl font-bold text-slate-800">{title}</div>
      )}

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="w-[1px] h-6 bg-slate-200 mx-2" />
        
        <div className="flex items-center gap-3 p-1 pr-2">
          <img 
            src="https://picsum.photos/seed/dafma/40/40" 
            alt="Avatar" 
            className="w-8 h-8 rounded-full border border-slate-200" 
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">Admin</p>
            <p className="text-[10px] text-slate-500 leading-tight">Agência DAFMA</p>
          </div>
        </div>
      </div>
    </header>
  );
}
