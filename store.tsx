
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Case, Message, UserRole, CaseStatus, Notification, CRMProfile, SmartDoc, AgendaItem, SavedCalculation } from './types';
import { supabase } from './services/supabaseClient';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  cases: Case[];
  notifications: Notification[];
  crmClients: CRMProfile[]; // Estado global de clientes do CRM
  smartDocs: SmartDoc[]; // Estado global de documentos
  agendaItems: AgendaItem[]; // Estado global da agenda
  savedCalculations: SavedCalculation[]; // Estado global de calculos
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: Omit<User, 'id' | 'createdAt' | 'avatar'>, password?: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  createCase: (data: { title: string; description: string; area: string; city: string; uf: string; price: number; complexity: string }) => Promise<void>;
  acceptCase: (caseId: string) => Promise<void>; // Agora funciona como "Manifestar Interesse"
  hireLawyer: (caseId: string, lawyerId: string) => Promise<void>; // Nova função para o cliente escolher
  sendMessage: (caseId: string, content: string, type?: 'text' | 'image' | 'file') => Promise<void>;
  toggleLawyerVerification: (userId: string, status: boolean) => Promise<void>;
  closeCase: (caseId: string, rating: number, comment: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  buyJuris: (amount: number) => Promise<void>;
  subscribePremium: () => Promise<void>;
  togglePremiumStatus: (userId: string, status: boolean) => Promise<void>;
  
  // Funções CRM, Docs, Agenda e Calc
  fetchCRMClients: () => Promise<void>;
  addCRMClient: (clientData: Omit<CRMProfile, 'id' | 'lawyerId' | 'createdAt'>) => Promise<void>;
  updateCRMClient: (id: string, data: Partial<CRMProfile>) => Promise<void>;
  fetchSmartDocs: () => Promise<void>;
  addSmartDoc: (docData: Omit<SmartDoc, 'id' | 'lawyerId' | 'date'>) => Promise<void>;
  fetchAgendaItems: () => Promise<void>;
  addAgendaItem: (itemData: Omit<AgendaItem, 'id' | 'lawyerId' | 'status' | 'clientName'>) => Promise<void>;
  fetchSavedCalculations: () => Promise<void>;
  saveCalculation: (calcData: Omit<SavedCalculation, 'id' | 'lawyerId' | 'createdAt'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [crmClients, setCrmClients] = useState<CRMProfile[]>([]);
  const [smartDocs, setSmartDocs] = useState<SmartDoc[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [session, setSession] = useState<any>(null);

  // 1. Monitorar estado de autenticação
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setCases([]);
        setNotifications([]);
        setCrmClients([]);
        setSmartDocs([]);
        setAgendaItems([]);
        setSavedCalculations([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Buscar dados quando o usuário estiver logado
  useEffect(() => {
    if (currentUser) {
      fetchUsers();
      fetchCases();
      fetchNotifications();
      
      if (currentUser.role === UserRole.LAWYER) {
          fetchCRMClients();
          fetchSmartDocs();
          fetchAgendaItems();
          fetchSavedCalculations();
      }

      // Configurar Realtime para atualizações (básico)
      const channel = supabase
        .channel('public_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, () => fetchCases())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'case_interests' }, () => fetchCases()) // Escutar interesses
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchCases())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchNotifications())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
             fetchUsers();
             if (currentUser) fetchUserProfile(currentUser.id); 
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_clients' }, () => fetchCRMClients())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'smart_docs' }, () => fetchSmartDocs())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'agenda_items' }, () => fetchAgendaItems())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'saved_calculations' }, () => fetchSavedCalculations())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser?.id]);

  // --- FUNÇÕES DE BUSCA ---

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
    } else if (data) {
      setCurrentUser({
        ...data,
        createdAt: data.created_at,
        oab: data.oab || undefined,
        verified: data.verified || false,
        isPremium: data.is_premium || false,
        balance: data.balance || 0
      });
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) {
      setUsers(data.map((u: any) => ({ 
        ...u, 
        createdAt: u.created_at,
        isPremium: u.is_premium || false
      })));
    }
  };

  const fetchCases = async () => {
    // Busca casos, mensagens e agora interesses (com perfil do advogado)
    const { data: casesData } = await supabase
      .from('cases')
      .select(`*, messages (*), case_interests ( lawyer_id, profiles (*) )`)
      .order('created_at', { ascending: false });

    if (casesData) {
      const formattedCases: Case[] = casesData.map((c: any) => {
        // Mapeamento robusto para advogados interessados
        const interested = c.case_interests ? c.case_interests.map((i: any) => {
           // Supabase pode retornar array ou objeto dependendo da relação, garantimos que seja objeto
           const profile = Array.isArray(i.profiles) ? i.profiles[0] : i.profiles;
           if (!profile) return null;
           return {
             ...profile,
             id: i.lawyer_id, // Forçar ID correto
             isPremium: profile.is_premium
           };
        }).filter(Boolean) : [];

        return {
          id: c.id,
          clientId: c.client_id,
          lawyerId: c.lawyer_id,
          title: c.title,
          description: c.description,
          area: c.area,
          status: c.status as CaseStatus,
          city: c.city,
          uf: c.uf,
          createdAt: c.created_at,
          price: c.price,
          complexity: c.complexity,
          isPaid: c.is_paid,
          feedback: c.feedback_rating ? { rating: c.feedback_rating, comment: c.feedback_comment } : undefined,
          interestedLawyers: interested,
          messages: (c.messages || []).map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            content: m.content,
            type: m.type,
            fileUrl: m.file_url,
            timestamp: m.timestamp
          })).sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        };
      });
      setCases(formattedCases);
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('timestamp', { ascending: false });
    
    if (data) {
      const formatted: Notification[] = data.map((n: any) => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          read: n.read,
          type: n.type,
          timestamp: n.timestamp || n.created_at 
      }));
      setNotifications(formatted);
    }
  };

  const fetchCRMClients = async () => {
      if (!currentUser) return;
      const { data } = await supabase
        .from('crm_clients')
        .select('*')
        .eq('lawyer_id', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (data) {
          const formatted: CRMProfile[] = data.map((c: any) => ({
              id: c.id,
              lawyerId: c.lawyer_id,
              name: c.name,
              type: c.type,
              cpf_cnpj: c.cpf_cnpj,
              rg: c.rg,
              email: c.email,
              phone: c.phone,
              address: c.address,
              profession: c.profession,
              civil_status: c.civil_status,
              riskScore: c.risk_score,
              status: c.status,
              notes: c.notes,
              createdAt: c.created_at
          }));
          setCrmClients(formatted);
      }
  };

  const fetchSmartDocs = async () => {
      if (!currentUser) return;
      const { data } = await supabase
        .from('smart_docs')
        .select('*')
        .eq('lawyer_id', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (data) {
           const formatted: SmartDoc[] = data.map((d: any) => ({
               id: d.id,
               lawyerId: d.lawyer_id,
               clientId: d.client_id,
               name: d.name,
               type: d.type,
               tags: d.tags || [],
               version: d.version,
               date: d.created_at,
               size: d.size,
               url: d.url
           }));
           setSmartDocs(formatted);
      }
  };

  const fetchAgendaItems = async () => {
      if (!currentUser) return;
      const { data } = await supabase
          .from('agenda_items')
          .select('*')
          .eq('lawyer_id', currentUser.id)
          .order('date', { ascending: true });
      
      if (data) {
          const formatted: AgendaItem[] = data.map((i: any) => ({
              id: i.id,
              lawyerId: i.lawyer_id,
              title: i.title,
              description: i.description,
              date: i.date,
              type: i.type,
              urgency: i.urgency,
              clientId: i.client_id,
              status: i.status
          }));
          setAgendaItems(formatted);

          // VERIFICAÇÃO DE PRAZOS VENCENDO (NOTIFICAÇÃO AUTOMÁTICA)
          const now = new Date();
          const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
          
          formatted.forEach(async (item) => {
              const itemDate = new Date(item.date);
              if (item.status === 'PENDING' && itemDate > now && itemDate < next48h) {
                  if (item.urgency === 'Alta') {
                      const { data: existingNotif } = await supabase.from('notifications')
                          .select('*')
                          .eq('user_id', currentUser.id)
                          .eq('title', 'Prazo Próximo!')
                          .ilike('message', `%${item.title}%`)
                          .eq('read', false);
                      
                      if (!existingNotif || existingNotif.length === 0) {
                          await supabase.from('notifications').insert({
                              user_id: currentUser.id,
                              title: 'Prazo Próximo!',
                              message: `Atenção: "${item.title}" vence em breve (${itemDate.toLocaleDateString()}).`,
                              type: 'warning'
                          });
                      }
                  }
              }
          });
      }
  };

  const fetchSavedCalculations = async () => {
      if (!currentUser) return;
      const { data } = await supabase
          .from('saved_calculations')
          .select('*')
          .eq('lawyer_id', currentUser.id)
          .order('created_at', { ascending: false });
      
      if (data) {
          const formatted: SavedCalculation[] = data.map((c: any) => ({
              id: c.id,
              lawyerId: c.lawyer_id,
              category: c.category,
              type: c.type,
              title: c.title,
              inputData: c.input_data,
              resultData: c.result_data,
              createdAt: c.created_at
          }));
          setSavedCalculations(formatted);
      }
  }

  const saveCalculation = async (calcData: Omit<SavedCalculation, 'id' | 'lawyerId' | 'createdAt'>) => {
      if (!currentUser) return;
      const { error } = await supabase.from('saved_calculations').insert({
          lawyer_id: currentUser.id,
          category: calcData.category,
          type: calcData.type,
          title: calcData.title,
          input_data: calcData.inputData,
          result_data: calcData.resultData
      });
      if (error) alert("Erro ao salvar cálculo: " + error.message);
      else {
          alert("Cálculo salvo no histórico!");
          fetchSavedCalculations();
      }
  }

  // --- AÇÕES ---

  const login = async (email: string, role: UserRole, password?: string) => {
    const pwd = password || '123456';
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });

    if (error) {
      if (email === 'admin@socialjuris.com' && error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email: 'admin@socialjuris.com', password: pwd });
        if (!signUpError && signUpData.user) {
           await supabase.from('profiles').upsert({
              id: signUpData.user.id,
              email: 'admin@socialjuris.com',
              name: 'Administrador',
              role: 'ADMIN',
              verified: true,
              is_premium: true,
              avatar: `https://ui-avatars.com/api/?name=Admin&background=random`,
              created_at: new Date().toISOString()
           });
           await fetchUserProfile(signUpData.user.id);
           return;
        }
      }
      if (error.message.includes("Email not confirmed")) {
         alert("⚠️ ACESSO BLOQUEADO: EMAIL NÃO CONFIRMADO\n\nVerifique seu email ou desabilite a confirmação no painel do Supabase.");
      } else {
         alert("Erro ao entrar: " + error.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'avatar'>, password?: string) => {
    if (!password) { alert("Senha obrigatória"); return; }
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: userData.email, password: password });

    if (authError) { alert("Erro no cadastro: " + authError.message); throw authError; }

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        oab: userData.role === 'LAWYER' ? userData.oab : null,
        verified: userData.role === 'CLIENT',
        balance: userData.role === 'LAWYER' ? 0 : null,
        is_premium: false,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
        created_at: new Date().toISOString()
      });

      if (profileError) alert("Erro ao criar perfil: " + profileError.message);
      else if (!authData.session) alert("✅ Cadastro realizado! Verifique seu email.");
      else await fetchUserProfile(authData.user.id);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    const { error } = await supabase.from('profiles').update({
        name: data.name, phone: data.phone, bio: data.bio, oab: data.oab
      }).eq('id', currentUser.id);
    if (!error) { alert("Perfil atualizado!"); fetchUserProfile(currentUser.id); }
  };

  const createCase = async (data: { title: string; description: string; area: string; city: string; uf: string; price: number; complexity: string }) => {
    if (!currentUser) return;
    const { data: newCase, error } = await supabase.from('cases').insert({
        client_id: currentUser.id, title: data.title, description: data.description, area: data.area, city: data.city, uf: data.uf, status: 'OPEN', price: data.price, complexity: data.complexity, is_paid: true
      }).select().single();

    if (!error && newCase) {
      await supabase.from('messages').insert({ case_id: newCase.id, sender_id: currentUser.id, content: `Caso criado com sucesso. Taxa de publicação (R$ ${data.price.toFixed(2)}) confirmada.`, type: 'system' });
      fetchCases();
    }
  };

  // --- NOVA LÓGICA DE MATCH (INTERESSE) ---
  
  const acceptCase = async (caseId: string) => {
    if (!currentUser || currentUser.role !== UserRole.LAWYER) return;
    const COST_IN_JURIS = 5;
    if ((currentUser.balance || 0) < COST_IN_JURIS) { alert("Saldo Insuficiente!"); return; }

    // 1. Debitar Saldo
    const { error: balanceError } = await supabase.from('profiles').update({ balance: (currentUser.balance || 0) - COST_IN_JURIS }).eq('id', currentUser.id);
    if (balanceError) return;

    // 2. Registrar Interesse (Em vez de fechar o caso)
    const { error } = await supabase.from('case_interests').insert({
        case_id: caseId,
        lawyer_id: currentUser.id
    });

    if (!error) {
      setCurrentUser(prev => prev ? ({ ...prev, balance: (prev.balance || 0) - COST_IN_JURIS }) : null);
      
      // Notificar Cliente
      const targetCase = cases.find(c => c.id === caseId);
      if (targetCase) {
        await supabase.from('notifications').insert({ 
            user_id: targetCase.clientId, 
            title: 'Nova Proposta', 
            message: `O Dr(a). ${currentUser.name} manifestou interesse no seu caso.`, 
            type: 'success' 
        });
      }
      alert(`Interesse enviado com sucesso! -${COST_IN_JURIS} Juris`);
      fetchCases();
    } else {
        // Se der erro (ex: tabela não existe), devolve o dinheiro
        await supabase.from('profiles').update({ balance: (currentUser.balance || 0) }).eq('id', currentUser.id);
        alert("Erro ao registrar interesse: " + error.message + " (Saldo estornado)");
    }
  };

  const hireLawyer = async (caseId: string, lawyerId: string) => {
      // Cliente escolhe o advogado -> Match definitivo
      const { error } = await supabase.from('cases').update({
          lawyer_id: lawyerId,
          status: 'ACTIVE'
      }).eq('id', caseId);

      if (!error) {
          const lawyer = users.find(u => u.id === lawyerId);
          await supabase.from('notifications').insert({
              user_id: lawyerId,
              title: 'Proposta Aceita!',
              message: 'O cliente escolheu você para o caso. O chat está liberado.',
              type: 'success'
          });
           await supabase.from('messages').insert({ case_id: caseId, sender_id: lawyerId, content: `Olá, agradeço a oportunidade. Vamos resolver seu caso!`, type: 'system' });
          fetchCases();
      }
  };

  // ------------------------------------------

  const buyJuris = async (amount: number) => {
      if (!currentUser) return;
      const newBalance = (currentUser.balance || 0) + amount;
      const { error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);
      if (!error) { setCurrentUser(prev => prev ? ({ ...prev, balance: newBalance }) : null); alert(`+${amount} Juris adicionados.`); }
  };

  const subscribePremium = async () => {
      if (!currentUser) return;
      const bonusJuris = 20;
      const { error } = await supabase.from('profiles').update({ is_premium: true, balance: (currentUser.balance || 0) + bonusJuris }).eq('id', currentUser.id);
      if (!error) {
          setCurrentUser(prev => prev ? ({ ...prev, isPremium: true, balance: (prev.balance || 0) + bonusJuris }) : null);
          await supabase.from('notifications').insert({ user_id: currentUser.id, title: 'Bem-vindo ao SocialJuris PRO', message: `Premium liberado + ${bonusJuris} Juris bônus!`, type: 'success' });
      }
  };

  const togglePremiumStatus = async (userId: string, status: boolean) => {
      await supabase.from('profiles').update({ is_premium: status }).eq('id', userId);
      fetchUsers();
  };

  const sendMessage = async (caseId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!currentUser) return;
    const { error } = await supabase.from('messages').insert({ case_id: caseId, sender_id: currentUser.id, content, type, file_url: type !== 'text' ? 'https://picsum.photos/400/300' : null });
    if (!error) {
        const currentCase = cases.find(c => c.id === caseId);
        if (currentCase) {
            const recipientId = currentUser.id === currentCase.clientId ? currentCase.lawyerId : currentCase.clientId;
            if (recipientId) await supabase.from('notifications').insert({ user_id: recipientId, title: 'Nova Mensagem', message: `${currentUser.name} enviou uma mensagem.`, type: 'info', read: false });
        }
        fetchCases();
    }
  };

  const toggleLawyerVerification = async (userId: string, status: boolean) => {
    const { error } = await supabase.from('profiles').update({ verified: status }).eq('id', userId);
    
    if (!error) {
        if (status) {
            await supabase.from('notifications').insert({ user_id: userId, title: 'Perfil Verificado', message: 'Sua conta foi aprovada.', type: 'success' });
        } else {
             await supabase.from('notifications').insert({ user_id: userId, title: 'Verificação Suspensa', message: 'Seu acesso foi temporariamente suspenso.', type: 'warning' });
        }
        fetchUsers();
    }
  };

  const closeCase = async (caseId: string, rating: number, comment: string) => {
    await supabase.from('cases').update({ status: 'CLOSED', feedback_rating: rating, feedback_comment: comment }).eq('id', caseId);
    fetchCases();
  };

  const markNotificationAsRead = async (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  // --- CRM, DOCS & AGENDA ACTIONS ---
  
  const addCRMClient = async (clientData: Omit<CRMProfile, 'id' | 'lawyerId' | 'createdAt'>) => {
      if (!currentUser) return;
      const { error } = await supabase.from('crm_clients').insert({
          lawyer_id: currentUser.id,
          name: clientData.name,
          type: clientData.type,
          cpf_cnpj: clientData.cpf_cnpj,
          rg: clientData.rg,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          profession: clientData.profession,
          civil_status: clientData.civil_status,
          risk_score: clientData.riskScore,
          status: clientData.status,
          notes: clientData.notes
      });

      if (error) alert("Erro ao salvar cliente: " + error.message);
      else {
          alert("Cliente salvo com sucesso!");
          fetchCRMClients();
      }
  };

  const updateCRMClient = async (id: string, data: Partial<CRMProfile>) => {
      const { error } = await supabase.from('crm_clients').update({
          name: data.name,
          type: data.type,
          cpf_cnpj: data.cpf_cnpj,
          rg: data.rg,
          email: data.email,
          phone: data.phone,
          address: data.address,
          profession: data.profession,
          civil_status: data.civil_status,
          notes: data.notes,
          status: data.status,
          risk_score: data.riskScore
      }).eq('id', id);

      if (error) {
          alert("Erro ao atualizar cliente: " + error.message);
      } else {
          alert("Dados do cliente atualizados!");
          fetchCRMClients();
      }
  };

  const addSmartDoc = async (docData: Omit<SmartDoc, 'id' | 'lawyerId' | 'date'>) => {
      if (!currentUser) return;
      const { error } = await supabase.from('smart_docs').insert({
          lawyer_id: currentUser.id,
          client_id: docData.clientId || null, // Link opcional
          name: docData.name,
          type: docData.type,
          tags: docData.tags,
          version: docData.version,
          size: docData.size,
          url: docData.url
      });
      if (error) alert("Erro ao salvar documento: " + error.message);
      else fetchSmartDocs();
  };

  const addAgendaItem = async (itemData: Omit<AgendaItem, 'id' | 'lawyerId' | 'status' | 'clientName'>) => {
      if (!currentUser) return;
      const { error } = await supabase.from('agenda_items').insert({
          lawyer_id: currentUser.id,
          title: itemData.title,
          description: itemData.description,
          date: itemData.date,
          type: itemData.type,
          urgency: itemData.urgency,
          client_id: itemData.clientId || null,
          status: 'PENDING'
      });
      
      if (error) alert("Erro ao agendar: " + error.message);
      else {
          alert("Compromisso agendado!");
          fetchAgendaItems();
      }
  };

  return (
    <AppContext.Provider value={{ currentUser, users, cases, notifications, crmClients, smartDocs, agendaItems, savedCalculations, login, logout, register, updateProfile, createCase, acceptCase, hireLawyer, sendMessage, toggleLawyerVerification, closeCase, markNotificationAsRead, buyJuris, subscribePremium, togglePremiumStatus, fetchCRMClients, addCRMClient, updateCRMClient, fetchSmartDocs, addSmartDoc, fetchAgendaItems, addAgendaItem, fetchSavedCalculations, saveCalculation }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
