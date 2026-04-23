'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Bell, 
  Settings, 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useConfig, Task } from '@/lib/config-context';
import { PageHeader } from './PageHeader';

export function TasksView() {
  const { tasks, clients, addTask, updateTask, removeTask } = useConfig();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClientId, setSelectedClientId] = useState<string>('0');
  const [status, setStatus] = useState<'Pendente' | 'Concluído'>('Pendente');

  const openForm = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setDescription(task.description);
      setDate(task.date);
      setSelectedClientId(task.clientId?.toString() || '0');
      setStatus(task.status);
    } else {
      setEditingTask(null);
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setSelectedClientId('0');
      setStatus('Pendente');
    }
    setShowForm(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const client = clients.find(c => c.id === selectedClientId);
    
    const taskData: Omit<Task, 'id'> = {
      description,
      date,
      clientId: selectedClientId,
      clientName: selectedClientId === '0' ? 'Sem cliente relacionado' : (client?.company || 'Cliente Desconhecido'),
      status
    };

    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id } as Task);
    } else {
      addTask(taskData);
    }
    
    setShowForm(false);
  };

  const toggleTaskStatus = (task: Task) => {
    updateTask({
      ...task,
      status: task.status === 'Pendente' ? 'Concluído' : 'Pendente'
    });
  };

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    status: 100,
    date: 150,
    clientName: 200,
    description: 400
  });

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleResize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.pageX;
    const startWidth = colWidths[id] || 150;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(80, startWidth + (moveEvent.pageX - startX));
      setColWidths(prev => ({ ...prev, [id]: newWidth }));
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const sortedTasksData = [...tasks].sort((a, b) => {
    if (!sortConfig) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    const { key, direction } = sortConfig;
    
    let aValue = (a as any)[key];
    let bValue = (b as any)[key];
    
    if (key === 'date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="Tarefas" showSearch={false} />

      <main className="p-8 space-y-8 max-w-[1800px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Gestão de Tarefas</h1>
            <p className="text-on-surface-variant mt-1">Organize as atividades e acompanhe o status em tempo real.</p>
          </div>
          <button 
            onClick={() => openForm()}
            className="bg-primary-container hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md"
          >
            <Plus size={18} />
            Nova Atividade
          </button>
        </div>

        {/* Task Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th 
                    style={{ width: colWidths.status }}
                    onClick={() => requestSort('status')}
                    className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 relative group"
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig?.key === 'status' && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      )}
                    </div>
                    <div onMouseDown={(e) => handleResize('status', e)} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary-container z-10" />
                  </th>
                  <th 
                    style={{ width: colWidths.date }}
                    onClick={() => requestSort('date')}
                    className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 relative group"
                  >
                    <div className="flex items-center gap-1">
                      Data
                      {sortConfig?.key === 'date' && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      )}
                    </div>
                    <div onMouseDown={(e) => handleResize('date', e)} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary-container z-10" />
                  </th>
                  <th 
                    style={{ width: colWidths.clientName }}
                    onClick={() => requestSort('clientName')}
                    className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 relative group"
                  >
                    <div className="flex items-center gap-1">
                      Cliente
                      {sortConfig?.key === 'clientName' && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      )}
                    </div>
                    <div onMouseDown={(e) => handleResize('clientName', e)} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary-container z-10" />
                  </th>
                  <th 
                    style={{ width: colWidths.description }}
                    onClick={() => requestSort('description')}
                    className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 relative group flex-1"
                  >
                    <div className="flex items-center gap-1">
                      Atividade
                      {sortConfig?.key === 'description' && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      )}
                    </div>
                    <div onMouseDown={(e) => handleResize('description', e)} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary-container z-10" />
                  </th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedTasksData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <Clock size={40} className="mx-auto mb-3 opacity-20" />
                      <p>Nenhuma atividade cadastrada.</p>
                    </td>
                  </tr>
                ) : (
                  sortedTasksData.map((task) => (
                    <tr 
                      key={task.id} 
                      className={cn(
                        "hover:bg-slate-50 transition-colors group",
                        task.status === 'Concluído' ? "bg-slate-50/50" : ""
                      )}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleTaskStatus(task)}
                          className={cn(
                            "transition-colors",
                            task.status === 'Concluído' ? "text-green-500" : "text-slate-300 hover:text-slate-400"
                          )}
                        >
                          {task.status === 'Concluído' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                           <Calendar size={14} className="text-slate-400" />
                           {new Date(task.date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-bold",
                          task.clientId === '0' || !task.clientId ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-600"
                        )}>
                          {task.clientName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={cn(
                          "text-sm font-medium text-on-surface",
                          task.status === 'Concluído' ? "line-through text-slate-400" : ""
                        )}>
                          {task.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openForm(task)}
                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                            title="Editar"
                          >
                            <Settings size={18} />
                          </button>
                          <button 
                            onClick={() => removeTask(task.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Modal Container */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">{editingTask ? 'Editar Atividade' : 'Nova Atividade'}</h3>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveTask} className="flex-1 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Descrição</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Subir campanha de pesquisa"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Data da Atividade</label>
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Cliente Relacionado</label>
                    <select 
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="0">Sem cliente relacionado</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.company}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{status}</span>
                      <div 
                        onClick={() => setStatus(status === 'Pendente' ? 'Concluído' : 'Pendente')}
                        className={cn(
                          "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                          status === 'Concluído' ? "bg-green-500" : "bg-slate-300"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                          status === 'Concluído' ? "right-1" : "left-1"
                        )} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex gap-4 mt-auto">
                    <button 
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-primary-container text-white rounded-lg font-bold text-sm hover:bg-orange-500 transition-all shadow-lg"
                    >
                      {editingTask ? 'Atualizar Tarefa' : 'Salvar Tarefa'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
