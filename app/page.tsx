'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, View } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { ClientManagement } from '@/components/ClientManagement';
import { SettingsView } from '@/components/SettingsView';
import { TasksView } from '@/components/TasksView';
import { useConfig } from '@/lib/config-context';
import { motion, AnimatePresence } from 'motion/react';
import { Settings } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { tasks, loading, user, authLoading, login } = useConfig();
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    // Check for today's tasks on mount
    if (user && tasks && tasks.length > 0 && !hasNotifiedRef.current) {
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = tasks.filter(t => t.date === today && t.status === 'Pendente');
      
      if (todayTasks.length > 0) {
        alert(`Você tem ${todayTasks.length} atividades para hoje!`);
        hasNotifiedRef.current = true;
      }
    }
  }, [tasks, user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9f9]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 overflow-hidden relative">
        {/* Abstract background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-2xl shadow-2xl max-w-md w-full text-center relative z-10"
        >
          <div className="w-20 h-20 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg">
            <Settings className="text-white w-10 h-10 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AGÊNCIA DAFMA</h1>
          <p className="text-slate-500 mb-10">O cérebro da sua operação de marketing, agora com proteção de dados.</p>
          
          <button 
            onClick={login}
            className="w-full py-4 bg-primary-container hover:bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-[0px_8px_24px_rgba(255,102,0,0.3)]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 bg-white rounded-full p-1" alt="Google logo" />
            Entrar com Google
          </button>
          
          <p className="mt-8 text-xs text-slate-400">
            Ao entrar, você concorda com os termos de uso e privacidade da Agência DAFMA.
          </p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9f9]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-xl font-bold text-slate-700">Sincronizando dados...</h1>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'settings':
        return <SettingsView />;
      case 'tasks':
        return <TasksView />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <h2 className="text-2xl font-bold uppercase tracking-widest opacity-20">Em breve</h2>
              <p className="mt-2">Esta funcionalidade está em desenvolvimento.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9f9]">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 sticky top-0 z-40">
          <h1 className="text-lg font-bold text-orange-600">DAFMA CRM</h1>
          <button className="p-2 text-slate-500">
            <Settings size={20} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Overlay */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
         {/* Could add a mobile menu trigger here if needed */}
      </div>
    </div>
  );
}
