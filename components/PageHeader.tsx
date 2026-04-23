'use client';

import React from 'react';
import { Search, Plus, Settings, LogOut } from 'lucide-react';
import { useConfig } from '@/lib/config-context';
import { motion, AnimatePresence } from 'motion/react';

interface PageHeaderProps {
  title?: string;
  showSearch?: boolean;
}

export function PageHeader({ title, showSearch = true }: PageHeaderProps) {
  const { user, logout, setShowGlobalNewClientModal } = useConfig();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

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
        <button 
          onClick={() => setShowGlobalNewClientModal(true)}
          className="bg-primary-container text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-orange-500 transition-all shadow-[0px_4px_12px_rgba(255,102,0,0.2)] shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">+ Novo Cliente</span>
          <span className="sm:hidden">+ Novo</span>
        </button>
        
        <div className="w-[1px] h-6 bg-slate-200 mx-2" />
        
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-2 rounded-lg transition-colors"
          >
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=FF6600&color=fff`} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-slate-200" 
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                {user?.displayName || 'Usuário'}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">Admin</p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-400 font-medium">Conectado como</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Settings size={16} />
                    Minha Conta
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut size={16} />
                    Sair do CRM
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
