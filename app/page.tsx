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
  const { tasks, loading } = useConfig();
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    // Check for today's tasks on mount
    if (tasks && tasks.length > 0 && !hasNotifiedRef.current) {
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = tasks.filter(t => t.date === today && t.status === 'Pendente');
      
      if (todayTasks.length > 0) {
        alert(`Você tem ${todayTasks.length} atividades para hoje!`);
        hasNotifiedRef.current = true;
      }
    }
  }, [tasks]);

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
