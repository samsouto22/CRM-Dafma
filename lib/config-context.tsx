'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User 
} from 'firebase/auth';
import { db, auth } from './firebase';

export interface Client {
  id: string;
  company: string;
  avatar: string;
  avatarBg: string;
  responsible: string;
  plan: string;
  monthly: string;
  origin: string;
  status: 'Ativo' | 'Inativo';
  startDate: string;
  totalPaid: string;
  [key: string]: any;
}

export interface ClientField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
}

export interface Task {
  id: string;
  description: string;
  date: string;
  clientId: string | number; // Support legacy migration
  clientName: string;
  status: 'Pendente' | 'Concluído';
}

interface ConfigContextType {
  plans: string[];
  origins: string[];
  fields: ClientField[];
  clients: Client[];
  tasks: Task[];
  loading: boolean;
  user: User | null;
  authLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addPlan: (plan: string) => void;
  removePlan: (plan: string) => void;
  addOrigin: (origin: string) => void;
  removeOrigin: (origin: string) => void;
  addField: (field: ClientField) => void;
  removeField: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<string[]>(['Aceleração Total', 'Google Performance', 'Meta Performance', 'Presença Total']);
  const [origins, setOrigins] = useState<string[]>(['Indicação', 'Google Ads', 'Meta Ads', 'Prospecção Ativa', 'Redes Sociais']);
  const [fields, setFields] = useState<ClientField[]>([
    { id: 'company', label: 'Empresa', type: 'text', placeholder: 'Nome da empresa' },
    { id: 'responsible', label: 'Nome Responsável', type: 'text', placeholder: 'Nome completo' },
    { id: 'monthly', label: 'Mensalidade (R$)', type: 'number', placeholder: '2500' },
    { id: 'payDay', label: 'Dia do Pagamento', type: 'number', placeholder: '10' },
    { id: 'startDate', label: 'Data Contrato', type: 'date' },
  ]);

  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth State Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setLoading(true);
      } else {
        setClients([]);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Sync Configuration
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'configuration', 'global'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.plans) setPlans(data.plans);
        if (data.origins) setOrigins(data.origins);
        if (data.fields) setFields(data.fields);
      }
    }, (error) => console.error("Error syncing config:", error));
    return () => unsub();
  }, [user]);

  // Sync Clients
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'clients'), orderBy('startDate', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const clientsData: Client[] = [];
      snapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() } as Client);
      });
      setClients(clientsData);
      setLoading(false);
    }, (error) => {
      console.error("Error syncing clients:", error);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // Sync Tasks
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tasks'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
    }, (error) => console.error("Error syncing tasks:", error));
    return () => unsub();
  }, [user]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const saveConfig = async (newPlans: string[], newOrigins: string[], newFields: ClientField[]) => {
    if (!user) return;
    await setDoc(doc(db, 'configuration', 'global'), {
      plans: newPlans,
      origins: newOrigins,
      fields: newFields
    });
  };

  const addPlan = (plan: string) => {
    if (!plans.includes(plan)) {
      const newPlans = [...plans, plan];
      setPlans(newPlans);
      saveConfig(newPlans, origins, fields);
    }
  };

  const removePlan = (plan: string) => {
    const newPlans = plans.filter(p => p !== plan);
    setPlans(newPlans);
    saveConfig(newPlans, origins, fields);
  };

  const addOrigin = (origin: string) => {
    if (!origins.includes(origin)) {
      const newOrigins = [...origins, origin];
      setOrigins(newOrigins);
      saveConfig(plans, newOrigins, fields);
    }
  };

  const removeOrigin = (origin: string) => {
    const newOrigins = origins.filter(o => o !== origin);
    setOrigins(newOrigins);
    saveConfig(plans, newOrigins, fields);
  };

  const addField = (field: ClientField) => {
    const newFields = [...fields, field];
    setFields(newFields);
    saveConfig(plans, origins, newFields);
  };

  const removeField = (id: string) => {
    const newFields = fields.filter(f => f.id !== id);
    setFields(newFields);
    saveConfig(plans, origins, newFields);
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    await addDoc(collection(db, 'clients'), client);
  };

  const updateClient = async (updatedClient: Client) => {
    const { id, ...data } = updatedClient;
    await updateDoc(doc(db, 'clients', id), data);
  };

  const removeClient = async (id: string) => {
    await deleteDoc(doc(db, 'clients', id));
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    await addDoc(collection(db, 'tasks'), task);
  };

  const updateTask = async (updatedTask: Task) => {
    const { id, ...data } = updatedTask;
    await updateDoc(doc(db, 'tasks', id), data);
  };

  const removeTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  return (
    <ConfigContext.Provider value={{ 
      plans, origins, fields, clients, tasks, loading,
      user, authLoading, login, logout,
      addPlan, removePlan, addOrigin, removeOrigin, 
      addField, removeField, addClient, updateClient, removeClient,
      addTask, updateTask, removeTask
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
