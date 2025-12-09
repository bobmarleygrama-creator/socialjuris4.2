
import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, CaseStatus, Case, User, Notification, SmartDoc, JurisprudenceResult, AgendaItem, CRMProfile, SavedCalculation } from '../types';
import { Plus, Briefcase, MessageSquare, Check, X, Bell, User as UserIcon, LogOut, Award, DollarSign, Users, Activity, Filter, Search, Save, Settings, Phone, Mail, Shield, AlertCircle, MapPin, CreditCard, Coins, Loader2, Lock, FileText, Calculator, Calendar, Scale, Sparkles, BrainCircuit, TrendingUp, BarChart3, AlertTriangle, Zap, FileSearch, Folders, Clock, Eye, XCircle, Hammer, LayoutGrid, PieChart, ChevronRight, Copy, Printer, BookOpen, Download, RefreshCw, ChevronDown, GraduationCap, Heart, Landmark, BriefcaseBusiness, FileSpreadsheet, Upload, Tags, PenTool, ClipboardList, UserPlus, List, Edit2, Paperclip, Globe, Ban, CheckCircle2 } from 'lucide-react';
import { Chat } from './Chat';
import { analyzeCaseDescription, calculateCasePrice, autoTagDocument, searchJurisprudence, generateLegalDraft, analyzeCRMRisk, diagnoseIntake, calculateLegalMath } from '../services/geminiService';

// --- CONSTANTES ---
const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type ViewType = 'dashboard' | 'profile' | 'notifications' | 'new-case' | 'premium_sales' | 'market' | 'my-cases' | 
                'tool-docs' | 'tool-juris' | 'tool-writer' | 'tool-agenda' | 'tool-crm' | 'tool-intake' | 'tool-calc';

// --- SHARED COMPONENTS ---

const UserProfile: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    oab: currentUser?.oab || '',
    bio: currentUser?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
           <div className="relative group">
              <img src={currentUser?.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover shadow-md" />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <span className="text-white text-xs font-bold">Alterar</span>
              </div>
           </div>
           <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h2>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-500">
                  <span className="capitalize">{currentUser?.role === 'LAWYER' ? 'Advogado' : currentUser?.role === 'CLIENT' ? 'Cliente' : 'Administrador'}</span>
                  {currentUser?.verified && <Check className="w-4 h-4 text-green-500" />}
                  {currentUser?.isPremium && <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 flex items-center"><Sparkles className="w-3 h-3 mr-1"/> PRO</span>}
              </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
               <div className="relative">
                 <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">Email</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">Telefone</label>
               <div className="relative">
                 <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
               </div>
            </div>
            {currentUser?.role === UserRole.LAWYER && (
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700">OAB</label>
                   <div className="relative">
                     <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                     <input type="text" name="oab" value={formData.oab} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                   </div>
                </div>
            )}
          </div>

          {currentUser?.role === UserRole.LAWYER && (
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Biografia Profissional</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Conte um pouco sobre sua experiência..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
             </div>
          )}

          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
               <Save className="w-5 h-5" />
               <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationList: React.FC = () => {
  const { notifications, currentUser, markNotificationAsRead } = useApp();
  const myNotifications = notifications.filter(n => n.userId === currentUser?.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Suas Notificações</h2>
            <span className="text-xs font-medium text-slate-500">{myNotifications.filter(n => !n.read).length} não lidas</span>
         </div>
         <div className="divide-y divide-slate-100">
            {myNotifications.length === 0 ? (
                <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500">Você não tem novas notificações.</p>
                </div>
            ) : (
                myNotifications.map(n => (
                    <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-6 flex items-start space-x-4 hover:bg-slate-50 transition cursor-pointer ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                        <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${
                            n.type === 'success' ? 'bg-green-100 text-green-600' :
                            n.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                           {n.type === 'success' ? <Check className="w-4 h-4"/> : n.type === 'warning' ? <AlertCircle className="w-4 h-4"/> : <Bell className="w-4 h-4"/>}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`text-sm font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{new Date(n.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className={`text-sm mt-1 ${!n.read ? 'text-slate-800' : 'text-slate-500'}`}>{n.message}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
                    </div>
                ))
            )}
         </div>
       </div>
    </div>
  );
};

const ToolCRM: React.FC = () => {
    const { crmClients, addCRMClient, updateCRMClient, smartDocs, addSmartDoc } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingClient, setViewingClient] = useState<CRMProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);
    
    // Form State for New Client
    const [newClient, setNewClient] = useState({
        name: '', type: 'PF' as 'PF'|'PJ', cpf_cnpj: '', rg: '', email: '', phone: '',
        address: '', profession: '', civil_status: '', notes: ''
    });

    // Form State for Editing Client
    const [editForm, setEditForm] = useState<Partial<CRMProfile>>({});

    const handleSaveClient = async () => {
        if (!newClient.name) return alert("Nome é obrigatório");
        setLoading(true);
        const riskAnalysis = await analyzeCRMRisk(newClient.name, newClient.type);
        await addCRMClient({
            ...newClient,
            riskScore: riskAnalysis.riskScore as any,
            status: 'Prospecção',
        });
        setLoading(false);
        setIsModalOpen(false);
        setNewClient({ name: '', type: 'PF', cpf_cnpj: '', rg: '', email: '', phone: '', address: '', profession: '', civil_status: '', notes: '' });
    };

    const handleUpdateClient = async () => {
        if (!viewingClient) return;
        setLoading(true);
        await updateCRMClient(viewingClient.id, editForm);
        setViewingClient(prev => prev ? ({ ...prev, ...editForm }) : null);
        setLoading(false);
        setIsEditing(false);
    };

    const handleQuickFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && viewingClient) {
            setFileUploading(true);
            const file = e.target.files[0];
            const aiData = await autoTagDocument(file.name);
            await addSmartDoc({
                name: file.name,
                type: aiData.type as any,
                tags: aiData.tags,
                version: 1,
                size: (file.size / 1024).toFixed(2) + ' KB',
                url: '#',
                clientId: viewingClient.id
            });
            setFileUploading(false);
        }
    };

    const startEditing = () => {
        if (viewingClient) {
            setEditForm(viewingClient);
            setIsEditing(true);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const clientDocs = viewingClient ? smartDocs.filter(d => d.clientId === viewingClient.id) : [];

    return (
        <div className="space-y-6">
             <header className="flex justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">CRM & KYC Jurídico</h2>
                    <p className="text-slate-500">Gestão de carteira e análise de risco.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg hover:bg-indigo-700 transition">
                    <UserPlus className="w-4 h-4 mr-2"/> Novo Cliente
                </button>
            </header>

            {/* Client List */}
            <div className="grid gap-4">
                {crmClients.length === 0 && (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
                        <p className="text-slate-500">Nenhum cliente cadastrado no banco de dados.</p>
                    </div>
                )}
                {crmClients.map(client => (
                    <div 
                        key={client.id} 
                        onClick={() => { setViewingClient(client); setIsEditing(false); }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm hover:border-indigo-300 transition cursor-pointer group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{client.name}</h3>
                                <div className="flex space-x-2 mt-1">
                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">{client.type}</span>
                                    {client.cpf_cnpj && <span className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded">{client.cpf_cnpj}</span>}
                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${client.riskScore === 'Alto' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>Risco {client.riskScore}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden md:block">
                                 <p className="text-xs text-slate-400">Email</p>
                                 <p className="text-sm font-medium text-slate-700">{client.email || '-'}</p>
                            </div>
                            <div className="text-slate-300 group-hover:text-indigo-600 transition"><ChevronRight/></div>
                        </div>
                    </div>
                ))}
            </div>

            {viewingClient && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 relative">
                        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                             <div className="flex items-center space-x-4">
                                 <div className="w-16 h-16 bg-white border-4 border-white shadow-sm rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                                     {viewingClient.name.charAt(0)}
                                 </div>
                                 <div>
                                     {isEditing ? (
                                         <input 
                                            value={editForm.name || ''} 
                                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                                            className="text-2xl font-bold text-slate-900 border-b border-indigo-300 bg-transparent focus:outline-none w-full"
                                            placeholder="Nome do Cliente"
                                         />
                                     ) : (
                                        <h2 className="text-2xl font-bold text-slate-900">{viewingClient.name}</h2>
                                     )}
                                     
                                     <div className="flex items-center space-x-2 mt-1">
                                         <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">{viewingClient.type}</span>
                                         <span className={`px-2 py-0.5 rounded text-xs font-bold ${viewingClient.riskScore === 'Alto' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>Risco {viewingClient.riskScore}</span>
                                     </div>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-2">
                                 {!isEditing ? (
                                     <button onClick={startEditing} className="p-2 bg-white rounded-full hover:bg-slate-200 transition text-indigo-600" title="Editar Cliente">
                                         <Edit2 className="w-5 h-5"/>
                                     </button>
                                 ) : (
                                    <>
                                        <button onClick={handleUpdateClient} disabled={loading} className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition text-green-700" title="Salvar">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Check className="w-5 h-5"/>}
                                        </button>
                                        <button onClick={cancelEditing} className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition text-red-700" title="Cancelar">
                                            <X className="w-5 h-5"/>
                                        </button>
                                    </>
                                 )}
                                 <button onClick={() => setViewingClient(null)} className="p-2 bg-white rounded-full hover:bg-slate-200 transition text-slate-500">
                                    <X className="w-5 h-5"/>
                                 </button>
                             </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-6">
                                 <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase text-xs tracking-wider">Dados Pessoais</h3>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <p className="text-xs text-slate-400">CPF / CNPJ</p>
                                         {isEditing ? (
                                             <input value={editForm.cpf_cnpj || ''} onChange={e => setEditForm({...editForm, cpf_cnpj: e.target.value})} className="w-full p-1 border rounded text-sm"/>
                                         ) : (
                                             <p className="font-medium text-slate-800">{viewingClient.cpf_cnpj || 'N/A'}</p>
                                         )}
                                     </div>
                                     <div>
                                         <p className="text-xs text-slate-400">RG / IE</p>
                                         {isEditing ? (
                                             <input value={editForm.rg || ''} onChange={e => setEditForm({...editForm, rg: e.target.value})} className="w-full p-1 border rounded text-sm"/>
                                         ) : (
                                             <p className="font-medium text-slate-800">{viewingClient.rg || 'N/A'}</p>
                                         )}
                                     </div>
                                     <div>
                                         <p className="text-xs text-slate-400">Estado Civil</p>
                                         {isEditing ? (
                                             <input value={editForm.civil_status || ''} onChange={e => setEditForm({...editForm, civil_status: e.target.value})} className="w-full p-1 border rounded text-sm"/>
                                         ) : (
                                             <p className="font-medium text-slate-800">{viewingClient.civil_status || 'N/A'}</p>
                                         )}
                                     </div>
                                     <div>
                                         <p className="text-xs text-slate-400">Profissão</p>
                                         {isEditing ? (
                                             <input value={editForm.profession || ''} onChange={e => setEditForm({...editForm, profession: e.target.value})} className="w-full p-1 border rounded text-sm"/>
                                         ) : (
                                             <p className="font-medium text-slate-800">{viewingClient.profession || 'N/A'}</p>
                                         )}
                                     </div>
                                 </div>
                                 
                                 <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase text-xs tracking-wider mt-6">Contato</h3>
                                 <div className="space-y-3">
                                     <div>
                                         <p className="text-xs text-slate-400">Email</p>
                                         {isEditing ? (
                                             <input value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-1 border rounded text-sm"/>
                                         ) : (
                                             <p className="font-medium text-slate-800">{viewingClient.email || 'N/A'}</p>
                                         )}
                                     </div>
                                     <div>
                                         <p className="text-xs text-slate-400">Telefone</p>
                                         {isEditing ? (
                                             <input value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-1 border rounded text-sm"/>
                                         ) : (
                                             <p className="font-medium text-slate-800">{viewingClient.phone || 'N/A'}</p>
                                         )}
                                     </div>
                                     <div>
                                         <p className="text-xs text-slate-400">Endereço</p>
                                         {isEditing ? (
                                             <input value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full p-1 border rounded text-sm"/>
                                         ) : (
                                             <p className="font-medium text-slate-800">{viewingClient.address || 'N/A'}</p>
                                         )}
                                     </div>
                                 </div>
                             </div>

                             <div className="space-y-6">
                                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase text-xs tracking-wider">Notas Internas</h3>
                                  {isEditing ? (
                                      <textarea 
                                        value={editForm.notes || ''} 
                                        onChange={e => setEditForm({...editForm, notes: e.target.value})}
                                        className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-900 min-h-[100px] focus:outline-none"
                                      />
                                  ) : (
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800 min-h-[100px]">
                                        {viewingClient.notes || "Sem observações registradas."}
                                    </div>
                                  )}

                                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase text-xs tracking-wider mt-6 flex justify-between items-center">
                                      <span>Documentos Vinculados</span>
                                      <div className="flex items-center gap-2">
                                          <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[10px] flex items-center shadow-sm transition">
                                              {fileUploading ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Upload className="w-3 h-3 mr-1"/>}
                                              Anexar
                                              <input type="file" className="hidden" onChange={handleQuickFileUpload} disabled={fileUploading} />
                                          </label>
                                          <span className="bg-indigo-100 text-indigo-700 px-2 rounded-full text-[10px] flex items-center h-5">{clientDocs.length}</span>
                                      </div>
                                  </h3>
                                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                      {clientDocs.length === 0 ? (
                                          <div className="text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
                                              <p className="text-slate-400 text-xs italic">Nenhum documento.</p>
                                          </div>
                                      ) : (
                                          clientDocs.map(doc => (
                                              <div key={doc.id} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-white hover:shadow-sm transition">
                                                  <FileText className="w-4 h-4 text-slate-400 mr-2"/>
                                                  <div className="flex-1 min-w-0">
                                                      <p className="text-sm font-bold text-slate-700 truncate">{doc.name}</p>
                                                      <p className="text-slate-400 text-[10px]">{new Date(doc.date).toLocaleDateString()}</p>
                                                  </div>
                                                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded whitespace-nowrap ml-2">{doc.type}</span>
                                              </div>
                                          ))
                                      )}
                                  </div>
                             </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={() => setViewingClient(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition">Fechar Dossiê</button>
                        </div>
                     </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-xl font-bold text-slate-900">Cadastrar Novo Cliente</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400"/></button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                             <div className="col-span-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                                 <input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                                 <select value={newClient.type} onChange={e => setNewClient({...newClient, type: e.target.value as any})} className="w-full p-3 border border-slate-200 rounded-lg">
                                     <option value="PF">Pessoa Física</option>
                                     <option value="PJ">Pessoa Jurídica</option>
                                 </select>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">CPF / CNPJ</label>
                                 <input value={newClient.cpf_cnpj} onChange={e => setNewClient({...newClient, cpf_cnpj: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">RG / IE</label>
                                 <input value={newClient.rg} onChange={e => setNewClient({...newClient, rg: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Estado Civil</label>
                                 <input value={newClient.civil_status} onChange={e => setNewClient({...newClient, civil_status: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Profissão</label>
                                 <input value={newClient.profession} onChange={e => setNewClient({...newClient, profession: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Telefone</label>
                                 <input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                             </div>
                             <div className="col-span-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Endereço Completo</label>
                                 <input value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                             </div>
                             <div className="col-span-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                 <input value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                             </div>
                             <div className="col-span-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Notas Internas</label>
                                 <textarea value={newClient.notes} onChange={e => setNewClient({...newClient, notes: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg h-24"/>
                             </div>
                        </div>

                        <div className="mt-8">
                            <button onClick={handleSaveClient} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <Save className="w-5 h-5 mr-2"/>}
                                Salvar Cliente no Banco de Dados
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ToolDocs: React.FC = () => {
    const { smartDocs, addSmartDoc, crmClients } = useApp();
    const [uploading, setUploading] = useState(false);
    const [selectedClient, setSelectedClient] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setUploading(true);
            const file = e.target.files[0];
            const aiData = await autoTagDocument(file.name);
            
            await addSmartDoc({
                name: file.name,
                type: aiData.type as any,
                tags: aiData.tags,
                version: 1,
                size: (file.size / 1024).toFixed(2) + ' KB',
                url: '#', // Em um app real, seria o link do Storage
                clientId: selectedClient || undefined
            });
            
            setUploading(false);
            setSelectedClient('');
        }
    };

    const handleDownload = (doc: SmartDoc) => {
        if (doc.url && doc.url !== '#') {
            window.open(doc.url, '_blank');
        } else {
            alert(`⬇️ Simulando Download do Arquivo: ${doc.name}\n\nNota: Em produção, este botão baixaria o arquivo real do Supabase Storage.`);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gerenciador de Documentos</h2>
                    <p className="text-slate-500">IA detecta tipos e organiza automaticamente.</p>
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={selectedClient} 
                        onChange={e => setSelectedClient(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg text-sm"
                    >
                        <option value="">-- Vincular a Cliente (Opcional) --</option>
                        {crmClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-indigo-700 transition flex items-center">
                        <Upload className="w-4 h-4 mr-2"/> Upload
                        <input type="file" className="hidden" onChange={handleUpload}/>
                    </label>
                </div>
            </header>
            
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Cliente Vinculado</th>
                            <th className="p-4">Tipo (IA)</th>
                            <th className="p-4">Tags</th>
                            <th className="p-4">Data</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {uploading && (
                            <tr><td colSpan={6} className="p-8 text-center text-indigo-500"><Loader2 className="w-6 h-6 animate-spin mx-auto"/> Processando com IA...</td></tr>
                        )}
                        {smartDocs.length === 0 && !uploading && (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-400">Nenhum documento. Faça upload para testar a IA.</td></tr>
                        )}
                        {smartDocs.map(doc => {
                            const clientName = crmClients.find(c => c.id === doc.clientId)?.name;
                            return (
                                <tr key={doc.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-800 flex items-center"><FileText className="w-4 h-4 mr-2 text-slate-400"/> {doc.name}</td>
                                    <td className="p-4 text-slate-600">{clientName ? <span className="flex items-center"><UserIcon className="w-3 h-3 mr-1"/> {clientName}</span> : '-'}</td>
                                    <td className="p-4"><span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">{doc.type}</span></td>
                                    <td className="p-4 flex gap-1 flex-wrap">
                                        {doc.tags.map(t => <span key={t} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] border border-slate-200">#{t}</span>)}
                                    </td>
                                    <td className="p-4 text-slate-500">{new Date(doc.date).toLocaleDateString()}</p>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDownload(doc)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            title="Baixar Documento"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ToolJuris: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<JurisprudenceResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        const data = await searchJurisprudence(query);
        setResults(data as any);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-2xl font-bold text-slate-900">Analisador de Jurisprudência</h2>
                <p className="text-slate-500">Busca inteligente e análise de risco.</p>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Ex: Dano moral extravio bagagem voo internacional" 
                        className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5 mr-2"/>}
                        Pesquisar
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {results.map((res, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded text-sm">{res.court}</span>
                            <span className={`px-3 py-1 rounded text-sm font-bold ${res.outcome === 'Favorável' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {res.outcome}
                            </span>
                        </div>
                        <p className="text-slate-600 mb-4 leading-relaxed">{res.summary}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full" style={{ width: `${res.relevance}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-indigo-600">{res.relevance}% Relevância</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ToolWriter: React.FC = () => {
    const { crmClients } = useApp();
    const [config, setConfig] = useState({ type: 'Peticao Inicial', clientName: '', facts: '', tone: 'Formal' });
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        const text = await generateLegalDraft(config);
        setResult(text);
        setLoading(false);
    };
    
    const handleSelectClient = (clientId: string) => {
        const client = crmClients.find(c => c.id === clientId);
        if (client) {
            const clientContext = `Cliente: ${client.name}, CPF: ${client.cpf_cnpj || 'N/A'}, Endereço: ${client.address || 'N/A'}`;
            setConfig(prev => ({ ...prev, clientName: client.name, facts: clientContext + "\n\n" + prev.facts }));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 overflow-y-auto">
                <h3 className="font-bold text-lg mb-6 flex items-center"><PenTool className="w-5 h-5 mr-2 text-indigo-500"/> Configuração da Minuta</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Peça</label>
                        <select className="w-full p-2 border rounded-lg" value={config.type} onChange={e => setConfig({...config, type: e.target.value})}>
                            <option>Petição Inicial</option>
                            <option>Contestação</option>
                            <option>Contrato de Honorários</option>
                            <option>Procuração</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Puxar do CRM</label>
                        <select className="w-full p-2 border rounded-lg mb-2" onChange={e => handleSelectClient(e.target.value)}>
                            <option value="">-- Selecionar Cliente --</option>
                            {crmClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Cliente (Manual)</label>
                        <input className="w-full p-2 border rounded-lg" value={config.clientName} onChange={e => setConfig({...config, clientName: e.target.value})} placeholder="Nome do cliente" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tom de Voz</label>
                        <select className="w-full p-2 border rounded-lg" value={config.tone} onChange={e => setConfig({...config, tone: e.target.value})}>
                            <option>Formal</option>
                            <option>Agressivo</option>
                            <option>Conciliador</option>
                            <option>Técnico</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Fatos / Resumo</label>
                        <textarea className="w-full p-2 border rounded-lg h-32" value={config.facts} onChange={e => setConfig({...config, facts: e.target.value})} placeholder="Descreva os fatos principais..." />
                    </div>
                    <button onClick={handleGenerate} disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">
                        {loading ? 'Escrevendo...' : 'Gerar Minuta com IA'}
                    </button>
                </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {result || <span className="text-slate-400 italic">A minuta gerada aparecerá aqui...</span>}
            </div>
        </div>
    );
};

const ToolAgenda: React.FC = () => {
    const { agendaItems, addAgendaItem, crmClients } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [newItem, setNewItem] = useState({
        title: '', date: '', time: '', type: 'Judicial' as any, urgency: 'Média' as any, clientId: '', description: ''
    });

    const handleSave = async () => {
        if (!newItem.title || !newItem.date || !newItem.time) return alert("Preencha título, data e hora.");
        setLoading(true);
        
        const dateTime = new Date(`${newItem.date}T${newItem.time}`).toISOString();
        
        await addAgendaItem({
            title: newItem.title,
            description: newItem.description,
            date: dateTime,
            type: newItem.type,
            urgency: newItem.urgency,
            clientId: newItem.clientId || undefined
        });

        setLoading(false);
        setIsModalOpen(false);
        setNewItem({ title: '', date: '', time: '', type: 'Judicial', urgency: 'Média', clientId: '', description: '' });
    };

    // Helper to group items by timeline
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const getGroup = (dateStr: string) => {
        const d = new Date(dateStr);
        d.setHours(0,0,0,0);
        if (d.getTime() === today.getTime()) return 'Hoje';
        if (d.getTime() === tomorrow.getTime()) return 'Amanhã';
        return 'Próximos Dias';
    };

    const groupedItems = {
        'Hoje': agendaItems.filter(i => getGroup(i.date) === 'Hoje'),
        'Amanhã': agendaItems.filter(i => getGroup(i.date) === 'Amanhã'),
        'Próximos Dias': agendaItems.filter(i => getGroup(i.date) === 'Próximos Dias')
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Agenda Inteligente</h2>
                   <p className="text-slate-500">Prazos e audiências com alertas automáticos.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg hover:bg-indigo-700 transition">
                    <Plus className="w-4 h-4 mr-2"/> Novo Compromisso
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Hoje', 'Amanhã', 'Próximos Dias'].map((col) => (
                    <div key={col} className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[200px]">
                        <h3 className="font-bold text-slate-500 uppercase text-xs mb-4 flex justify-between items-center">
                            {col}
                            <span className="bg-slate-200 text-slate-600 px-2 rounded-full text-[10px]">{groupedItems[col as keyof typeof groupedItems].length}</span>
                        </h3>
                        <div className="space-y-3">
                            {groupedItems[col as keyof typeof groupedItems].length === 0 && (
                                <p className="text-center text-slate-400 text-xs py-4 italic">Livre</p>
                            )}
                            {groupedItems[col as keyof typeof groupedItems].map(item => {
                                const clientName = crmClients.find(c => c.id === item.clientId)?.name;
                                return (
                                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.urgency === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{item.urgency}</span>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                        {clientName && <p className="text-xs text-slate-500 mt-1 flex items-center"><UserIcon className="w-3 h-3 mr-1"/> {clientName}</p>}
                                        <div className="mt-2 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">{item.type}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-in zoom-in duration-300 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Novo Compromisso</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400"/></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                                <input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Audiência de Instrução"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Data</label>
                                    <input type="date" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Hora</label>
                                    <input type="time" value={newItem.time} onChange={e => setNewItem({...newItem, time: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                                    <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value as any})} className="w-full p-3 border border-slate-200 rounded-lg">
                                        <option>Judicial</option>
                                        <option>Administrativo</option>
                                        <option>Interno</option>
                                        <option>Diligencia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Urgência</label>
                                    <select value={newItem.urgency} onChange={e => setNewItem({...newItem, urgency: e.target.value as any})} className="w-full p-3 border border-slate-200 rounded-lg">
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Vincular Cliente (Opcional)</label>
                                <select value={newItem.clientId} onChange={e => setNewItem({...newItem, clientId: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg">
                                    <option value="">-- Selecione --</option>
                                    {crmClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                                <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg h-20 resize-none"/>
                            </div>
                            
                            <button onClick={handleSave} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center mt-2">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <Save className="w-5 h-5 mr-2"/>}
                                Salvar na Agenda
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ToolIntake: React.FC = () => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState('');
    const [diagnosis, setDiagnosis] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleDiagnose = async () => {
        setLoading(true);
        const result = await diagnoseIntake(answers);
        setDiagnosis(result);
        setLoading(false);
        setStep(2);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {step === 1 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Assistente de Triagem</h2>
                    <p className="text-slate-500 mb-6">Faça perguntas ao cliente ou digite o relato inicial para receber um diagnóstico automático.</p>
                    <textarea 
                        className="w-full h-40 p-4 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Relato do cliente..."
                        value={answers}
                        onChange={e => setAnswers(e.target.value)}
                    />
                    <button onClick={handleDiagnose} disabled={loading || !answers} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Realizar Diagnóstico'}
                    </button>
                </div>
            ) : (
                <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 animate-in slide-in-from-bottom-4">
                     <h2 className="text-2xl font-bold mb-6 text-indigo-900">Resultado da Triagem</h2>
                     <div className="space-y-6">
                         <div className="bg-white p-4 rounded-xl">
                             <p className="text-xs font-bold text-slate-400 uppercase">Área Identificada</p>
                             <p className="font-bold text-lg text-slate-900">{diagnosis?.area}</p>
                         </div>
                         <div className="bg-white p-4 rounded-xl">
                             <p className="text-xs font-bold text-slate-400 uppercase">Nível de Urgência</p>
                             <p className={`font-bold text-lg ${diagnosis?.urgency === 'Alta' ? 'text-red-600' : 'text-slate-900'}`}>{diagnosis?.urgency}</p>
                         </div>
                         <div className="bg-white p-4 rounded-xl">
                             <p className="text-xs font-bold text-slate-400 uppercase">Ação Sugerida</p>
                             <p className="text-slate-700">{diagnosis?.suggestedAction}</p>
                         </div>
                         <button onClick={() => {setStep(1); setAnswers(''); setDiagnosis(null);}} className="text-indigo-600 font-bold hover:underline">Nova Triagem</button>
                     </div>
                </div>
            )}
        </div>
    );
};

const ToolCalculators: React.FC = () => {
    const { saveCalculation } = useApp();
    const [selectedCategory, setSelectedCategory] = useState<string>('Trabalhista');
    const [selectedType, setSelectedType] = useState<string>('');
    const [inputs, setInputs] = useState<any>({});
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const categories = {
        'Trabalhista': ['Rescisão Completa', 'Férias', '13º Salário', 'Horas Extras', 'FGTS em Atraso'],
        'Previdenciário': ['Aposentadoria Idade', 'Aposentadoria Tempo', 'RMI', 'Atrasados INSS'],
        'Cível': ['Correção Monetária', 'Juros Moratórios', 'Danos Materiais', 'Atualização de Débitos'],
        'Família': ['Pensão Alimentícia', 'Atualização Pensão', 'Partilha de Bens'],
        'Penal': ['Cálculo de Pena', 'Progressão de Regime', 'Prescrição'],
        'Tributário': ['Tributos Federais', 'SELIC', 'Restituição'],
        'Processual': ['Prazos CPC', 'Honorários', 'Custas']
    };

    const handleCalculate = async () => {
        setLoading(true);
        const calcResult = await calculateLegalMath(selectedCategory, selectedType, inputs);
        setResult(calcResult);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!result) return;
        await saveCalculation({
            category: selectedCategory,
            type: selectedType,
            title: `${selectedType} - ${new Date().toLocaleDateString()}`,
            inputData: inputs,
            resultData: result
        });
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Sidebar Categories */}
            <div className="col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">Categorias</div>
                <div className="flex-1 overflow-y-auto">
                    {Object.keys(categories).map(cat => (
                        <button 
                            key={cat}
                            onClick={() => {setSelectedCategory(cat); setSelectedType(categories[cat as keyof typeof categories][0]); setResult(null); setInputs({});}}
                            className={`w-full text-left p-4 hover:bg-slate-50 transition border-l-4 ${selectedCategory === cat ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-600'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calculator Area */}
            <div className="col-span-9 flex flex-col gap-6">
                {/* Type Selection & Input */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center">
                            <Calculator className="w-6 h-6 mr-2 text-indigo-600"/>
                            {selectedCategory}
                        </h2>
                        <select 
                            value={selectedType}
                            onChange={e => {setSelectedType(e.target.value); setResult(null);}}
                            className="p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium"
                        >
                            {categories[selectedCategory as keyof typeof categories].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                        <p className="text-sm text-slate-500 mb-4">Insira os dados para o cálculo de <strong>{selectedType}</strong>. Nossa IA processará com base na legislação vigente.</p>
                        
                        {/* Generic Dynamic Inputs (Prototype Simplification) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição dos Valores / Datas / Parâmetros</label>
                                <textarea 
                                    className="w-full p-3 border border-slate-300 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder={`Ex: Valor inicial R$ 10.000, Data 01/01/2023, Juros 1% a.m...`}
                                    value={inputs.description || ''}
                                    onChange={e => setInputs({...inputs, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={handleCalculate} 
                                disabled={loading || !inputs.description}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center shadow-lg shadow-indigo-600/20"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <Zap className="w-5 h-5 mr-2"/>}
                                Calcular Agora
                            </button>
                        </div>
                    </div>

                    {/* Results Area */}
                    {result && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                             <div className="border-t border-slate-100 pt-6">
                                 <div className="flex justify-between items-end mb-6">
                                     <div>
                                         <p className="text-sm font-bold text-slate-400 uppercase">Resultado Total</p>
                                         <p className="text-4xl font-bold text-slate-900 mt-1">
                                             {typeof result.total === 'number' ? `R$ ${result.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : result.total}
                                         </p>
                                     </div>
                                     <div className="flex gap-2">
                                         <button onClick={() => alert("PDF Gerado com sucesso!")} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50" title="Exportar PDF"><Printer className="w-5 h-5"/></button>
                                         <button onClick={handleSave} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-bold flex items-center"><Save className="w-4 h-4 mr-1"/> Salvar</button>
                                     </div>
                                 </div>

                                 <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                                     <table className="w-full text-sm text-left">
                                         <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-xs">
                                             <tr>
                                                 <th className="p-3">Item</th>
                                                 <th className="p-3">Valor / Detalhe</th>
                                                 <th className="p-3">Fundamento</th>
                                             </tr>
                                         </thead>
                                         <tbody className="divide-y divide-slate-200">
                                             {result.details && result.details.map((item: any, idx: number) => (
                                                 <tr key={idx}>
                                                     <td className="p-3 font-medium text-slate-700">{item.label}</td>
                                                     <td className="p-3 font-bold text-slate-900">{item.value}</td>
                                                     <td className="p-3 text-slate-500 text-xs italic">{item.description}</td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                     {result.summary && (
                                         <div className="p-4 bg-yellow-50 border-t border-yellow-100 text-yellow-800 text-sm">
                                             <strong>Resumo:</strong> {result.summary}
                                         </div>
                                     )}
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- DASHBOARDS ---

export const ClientDashboard: React.FC = () => {
    const { currentUser, cases, logout, createCase, hireLawyer } = useApp();
    const [view, setView] = useState<ViewType>('dashboard');
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    
    // New Case Form State
    const [description, setDescription] = useState('');
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');

    const myCases = cases.filter(c => c.clientId === currentUser?.id);

    const handleAnalyze = async () => {
        if (!description) return;
        setLoading(true);
        const result = await analyzeCaseDescription(description);
        setAnalysis(result);
        setLoading(false);
        setStep(2);
    };

    const handleCreate = async () => {
        if (!analysis) return;
        const price = calculateCasePrice(analysis.complexity);
        await createCase({
        title: analysis.title,
        description: description,
        area: analysis.area,
        complexity: analysis.complexity,
        city: city || 'Online',
        uf: uf || 'BR',
        price
        });
        setStep(1);
        setDescription('');
        setAnalysis(null);
        setView('dashboard');
    };

    const renderContent = () => {
        switch(view) {
        case 'profile': return <UserProfile />;
        case 'notifications': return <NotificationList />;
        case 'new-case':
            return (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                {step === 1 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Novo Caso</h2>
                    <p className="text-slate-500 mb-6">Descreva seu problema jurídico. Nossa IA irá analisar e categorizar para você.</p>
                    <textarea 
                        className="w-full h-40 p-4 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Ex: Comprei um produto que veio com defeito e a loja se recusa a trocar..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <button onClick={handleAnalyze} disabled={loading || !description} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analisar Caso'}
                    </button>
                </div>
                ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Revisão do Caso</h2>
                    
                    <div className="space-y-4 mb-8">
                        <div className="bg-indigo-50 p-4 rounded-xl">
                            <span className="text-xs font-bold text-slate-500 uppercase">Título Sugerido</span>
                            <p className="font-bold text-lg text-indigo-900">{analysis?.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Área</span>
                                <p className="font-bold text-slate-900">{analysis?.area}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Complexidade</span>
                                <p className="font-bold text-slate-900">{analysis?.complexity}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Cidade</label>
                                <input value={city} onChange={e => setCity(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50" placeholder="Ex: São Paulo" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Estado</label>
                                <select value={uf} onChange={e => setUf(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50">
                                    <option value="">UF</option>
                                    {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                            <div>
                            <span className="text-xs font-bold text-green-600 uppercase">Taxa de Publicação</span>
                            <p className="text-green-800 text-sm">Valor simbólico para garantir qualidade</p>
                            </div>
                            <span className="text-2xl font-bold text-green-700">R$ {calculateCasePrice(analysis?.complexity || 'Média').toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-800 transition">Voltar</button>
                        <button onClick={handleCreate} disabled={!city || !uf} className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            Confirmar e Publicar
                        </button>
                    </div>
                </div>
                )}
            </div>
            );
        default:
            return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-slate-900">Meus Casos</h2>
                        <button onClick={() => setView('new-case')} className="text-sm font-bold text-indigo-600 hover:underline">+ Novo</button>
                    </div>
                    {myCases.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                            <p className="text-slate-500 mb-4">Você ainda não tem casos.</p>
                            <button onClick={() => setView('new-case')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Começar Agora</button>
                        </div>
                    ) : (
                        myCases.map(c => (
                            <div 
                                key={c.id} 
                                onClick={() => setSelectedCase(c)}
                                className={`p-4 rounded-xl border cursor-pointer transition ${selectedCase?.id === c.id ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                            >
                                <div className="flex justify-between mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === 'OPEN' ? 'bg-green-100 text-green-700' : c.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {c.status === 'OPEN' ? 'Aguardando' : c.status === 'ACTIVE' ? 'Em Andamento' : 'Encerrado'}
                                    </span>
                                    <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-bold text-slate-800 line-clamp-1">{c.title}</h3>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="lg:col-span-2">
                    {selectedCase ? (
                        selectedCase.status === 'OPEN' ? (
                            <div className="bg-white h-full min-h-[400px] rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Briefcase className="w-6 h-6 text-indigo-600"/>
                                    Advogados Interessados
                                </h3>
                                
                                {selectedCase.interestedLawyers && selectedCase.interestedLawyers.length > 0 ? (
                                    <div className="w-full max-w-lg space-y-4">
                                        <p className="text-center text-slate-500 text-sm mb-4">Selecione um advogado abaixo para iniciar o atendimento.</p>
                                        {selectedCase.interestedLawyers.map(lawyer => (
                                            <div key={lawyer.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition bg-slate-50 group">
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative">
                                                        <img src={lawyer.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-slate-200"/>
                                                        {lawyer.verified && <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white"><Check className="w-2 h-2 text-white"/></div>}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{lawyer.name}</p>
                                                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                                                            <span>OAB: {lawyer.oab || 'N/A'}</span>
                                                            {lawyer.isPremium && <span className="bg-yellow-100 text-yellow-700 px-1.5 rounded-full flex items-center"><Sparkles className="w-2 h-2 mr-0.5"/> PRO</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => hireLawyer(selectedCase.id, lawyer.id)}
                                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition shadow-sm group-hover:shadow-md"
                                                >
                                                    Contratar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                                                <Search className="w-8 h-8 text-indigo-400"/>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-slate-700 mb-2">Buscando Advogados...</h4>
                                        <p className="text-slate-500 max-w-md text-center text-sm leading-relaxed">
                                            Seu caso está visível na vitrine de oportunidades. Assim que um advogado manifestar interesse, você receberá uma notificação e o perfil dele aparecerá aqui para você aprovar.
                                        </p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Chat 
                                currentCase={selectedCase} 
                                currentUser={currentUser!} 
                                otherPartyName="Dr. Advogado" 
                                onClose={() => setSelectedCase(null)} 
                            />
                        )
                    ) : (
                        <div className="bg-slate-50 h-full min-h-[400px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                            <p>Selecione um caso para ver detalhes</p>
                        </div>
                    )}
                </div>
            </div>
            );
        }
    };
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <div className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 transition-all duration-300">
            <div className="p-6 flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                    <Scale className="w-6 h-6 text-white"/>
                </div>
                <span className="text-xl font-bold hidden lg:block">SocialJuris</span>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-8">
                <button onClick={() => setView('dashboard')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <LayoutGrid className="w-5 h-5"/>
                    <span className="hidden lg:block font-medium">Painel</span>
                </button>
                <button onClick={() => setView('new-case')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${view === 'new-case' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Plus className="w-5 h-5"/>
                    <span className="hidden lg:block font-medium">Novo Caso</span>
                </button>
                <button onClick={() => setView('notifications')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${view === 'notifications' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Bell className="w-5 h-5"/>
                    <span className="hidden lg:block font-medium">Notificações</span>
                </button>
                <button onClick={() => setView('profile')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${view === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <UserIcon className="w-5 h-5"/>
                    <span className="hidden lg:block font-medium">Meu Perfil</span>
                </button>
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button onClick={logout} className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-900/20 transition">
                    <LogOut className="w-5 h-5"/>
                    <span className="hidden lg:block font-medium">Sair</span>
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-20 lg:ml-64 p-8 overflow-y-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                   <h1 className="text-2xl font-bold text-slate-900 capitalize">{view.replace('-', ' ')}</h1>
                   <p className="text-slate-500">Bem-vindo, {currentUser?.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                        <Coins className="w-4 h-4 text-yellow-500 mr-2"/>
                        <span className="font-bold text-slate-700">R$ {currentUser?.balance?.toFixed(2) || '0.00'}</span>
                    </div>
                    <img src={currentUser?.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
                </div>
            </header>
            {renderContent()}
        </div>
    </div>
  );
};

export const LawyerDashboard: React.FC = () => {
    const { currentUser, cases, acceptCase, logout, subscribePremium, buyJuris } = useApp();
    const [view, setView] = useState<ViewType>('market');
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [filterArea, setFilterArea] = useState('');
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const availableCases = cases.filter(c => c.status === 'OPEN' && (filterArea ? c.area.includes(filterArea) : true));
    const myActiveCases = cases.filter(c => c.lawyerId === currentUser?.id);

    const handleNavigate = (targetView: ViewType) => {
        const proTools: ViewType[] = ['tool-crm', 'tool-docs', 'tool-writer', 'tool-calc', 'tool-juris', 'tool-agenda', 'tool-intake'];
        
        if (proTools.includes(targetView) && !currentUser?.isPremium) {
            setShowPremiumModal(true);
        } else {
            setView(targetView);
        }
    };

    const handleSubscribe = async () => {
        await subscribePremium();
        setShowPremiumModal(false);
    }

    const PremiumModal = () => (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative border border-slate-700">
                <button 
                    onClick={() => setShowPremiumModal(false)} 
                    className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition"
                >
                    <X className="w-5 h-5 text-slate-400"/>
                </button>
                
                <div className="grid md:grid-cols-5 h-full">
                    <div className="md:col-span-2 bg-gradient-to-b from-indigo-600 to-purple-800 p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <div className="bg-white/10 backdrop-blur-md inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-white/20 mb-6">
                                <Sparkles className="w-3 h-3 mr-1 text-yellow-300"/> SocialJuris PRO
                            </div>
                            <h2 className="text-3xl font-extrabold mb-2 leading-tight">Desbloqueie o poder máximo da advocacia.</h2>
                            <p className="text-indigo-100 text-sm">Ferramentas de IA e gestão para quem joga em outro nível.</p>
                        </div>
                        <div className="relative z-10">
                             <p className="text-5xl font-extrabold text-white">R$ 69<span className="text-2xl text-indigo-200">,99</span></p>
                             <p className="text-indigo-200 text-xs mt-1">cobrado mensalmente</p>
                        </div>
                    </div>

                    <div className="md:col-span-3 p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            O que está incluído:
                        </h3>
                        <div className="grid grid-cols-1 gap-4 mb-8">
                            <div className="flex items-start space-x-3">
                                <div className="bg-indigo-900/50 p-2 rounded-lg"><Users className="w-5 h-5 text-indigo-400"/></div>
                                <div>
                                    <h4 className="font-bold text-sm">CRM & KYC Avançado</h4>
                                    <p className="text-xs text-slate-400">Gestão de clientes com análise de risco e dossiê completo.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-indigo-900/50 p-2 rounded-lg"><Folders className="w-5 h-5 text-indigo-400"/></div>
                                <div>
                                    <h4 className="font-bold text-sm">Smart Docs</h4>
                                    <p className="text-xs text-slate-400">Organização automática e vinculação de arquivos.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-indigo-900/50 p-2 rounded-lg"><PenTool className="w-5 h-5 text-indigo-400"/></div>
                                <div>
                                    <h4 className="font-bold text-sm">Redator IA</h4>
                                    <p className="text-xs text-slate-400">Geração de minutas com um clique usando dados do CRM.</p>
                                </div>
                            </div>
                             <div className="flex items-start space-x-3">
                                <div className="bg-indigo-900/50 p-2 rounded-lg"><Calculator className="w-5 h-5 text-indigo-400"/></div>
                                <div>
                                    <h4 className="font-bold text-sm">Calculadoras Jurídicas</h4>
                                    <p className="text-xs text-slate-400">Trabalhista, Cível, Penal, Família e mais.</p>
                                </div>
                            </div>
                             <div className="flex items-start space-x-3">
                                <div className="bg-indigo-900/50 p-2 rounded-lg"><BrainCircuit className="w-5 h-5 text-indigo-400"/></div>
                                <div>
                                    <h4 className="font-bold text-sm">Inteligência Estratégica</h4>
                                    <p className="text-xs text-slate-400">Análise de jurisprudência e triagem automática.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl mb-6 flex items-center justify-between border border-slate-700">
                             <div className="flex items-center space-x-2">
                                 <Coins className="w-5 h-5 text-yellow-400"/>
                                 <span className="font-bold text-sm text-yellow-400">BÔNUS EXCLUSIVO</span>
                             </div>
                             <span className="text-white text-sm font-bold">+20 Juris todo mês</span>
                        </div>

                        <button 
                            onClick={handleSubscribe}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center text-lg"
                        >
                            Assinar Agora <ChevronRight className="w-5 h-5 ml-2"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'tool-crm': return <ToolCRM />;
            case 'tool-docs': return <ToolDocs />;
            case 'tool-juris': return <ToolJuris />;
            case 'tool-writer': return <ToolWriter />;
            case 'tool-agenda': return <ToolAgenda />;
            case 'tool-intake': return <ToolIntake />;
            case 'tool-calc': return <ToolCalculators />;
            case 'profile': return <UserProfile />;
            case 'notifications': return <NotificationList />;
            case 'market':
                return (
                    <div className="space-y-6">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400"/>
                                <input 
                                    type="text" 
                                    placeholder="Filtrar por área jurídica..." 
                                    value={filterArea}
                                    onChange={e => setFilterArea(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableCases.length === 0 ? (
                                <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-200">
                                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
                                    <p className="text-slate-500">Nenhum caso disponível no momento para sua busca.</p>
                                </div>
                            ) : (
                                availableCases.map(c => {
                                    const hasShownInterest = c.interestedLawyers?.some(l => l.id === currentUser?.id);
                                    const interestCount = c.interestedLawyers?.length || 0;
                                    
                                    return (
                                    <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition group flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{c.area}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${c.complexity === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {c.complexity} Complexidade
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{c.title}</h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{c.description}</p>
                                        
                                        <div className="flex items-center text-xs text-slate-400 mb-4 space-x-3">
                                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {c.city}/{c.uf}</span>
                                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(c.createdAt).toLocaleDateString()}</span>
                                            {interestCount > 0 && (
                                                <span className="flex items-center text-indigo-600 font-bold bg-indigo-50 px-2 rounded-full" title={`${interestCount} advogados interessados`}>
                                                    <Users className="w-3 h-3 mr-1"/> {interestCount}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="text-xs">
                                                <p className="text-slate-400">Investimento</p>
                                                <p className="font-bold text-slate-900 flex items-center"><Coins className="w-3 h-3 text-yellow-500 mr-1"/> 5 Juris</p>
                                            </div>
                                            {hasShownInterest ? (
                                                <button 
                                                    disabled
                                                    className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center cursor-default"
                                                >
                                                    <Check className="w-4 h-4 mr-1"/> Interesse Enviado
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => acceptCase(c.id)} 
                                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition"
                                                >
                                                    Manifestar Interesse
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )})
                            )}
                        </div>
                    </div>
                );
            case 'my-cases':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
                        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-bold text-slate-700">Casos Ativos</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                 {myActiveCases.length === 0 && (
                                     <p className="text-center text-slate-400 text-sm py-8">Nenhum caso ativo.</p>
                                 )}
                                 {myActiveCases.map(c => (
                                     <div 
                                        key={c.id} 
                                        onClick={() => setSelectedCase(c)}
                                        className={`p-4 rounded-xl cursor-pointer transition border ${selectedCase?.id === c.id ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                                     >
                                         <h4 className="font-bold text-slate-800 text-sm">{c.title}</h4>
                                         <p className="text-xs text-slate-500 mt-1 truncate">Cliente ID: {c.clientId.substring(0,8)}</p>
                                     </div>
                                 ))}
                            </div>
                        </div>
                        <div className="lg:col-span-2 flex flex-col">
                            {selectedCase ? (
                                 <Chat 
                                    currentCase={selectedCase} 
                                    currentUser={currentUser!} 
                                    otherPartyName="Cliente" 
                                    onClose={() => setSelectedCase(null)}
                                 />
                            ) : (
                                <div className="flex-1 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                                    <Briefcase className="w-16 h-16 mb-4 opacity-50"/>
                                    <p className="font-medium">Selecione um caso para iniciar o atendimento</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default: return <div className="p-8 text-center text-slate-500">Selecione uma ferramenta no menu.</div>;
        }
    };
  
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Modal de Paywall */}
        {showPremiumModal && <PremiumModal />}

        {/* Lawyer Sidebar */}
        <div className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 transition-all duration-300">
            <div className="p-6 flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                    <Scale className="w-6 h-6 text-white"/>
                </div>
                <div>
                    <span className="text-xl font-bold hidden lg:block">SocialJuris</span>
                    <span className="text-[10px] uppercase tracking-widest text-indigo-400 hidden lg:block">Advogado</span>
                </div>
            </div>
            
            <div className="px-4 mb-6">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-slate-400 uppercase font-bold">Saldo</span>
                         <button onClick={() => buyJuris(10)} className="text-indigo-400 hover:text-white transition"><Plus className="w-4 h-4"/></button>
                     </div>
                     <div className="flex items-end space-x-1">
                         <span className="text-2xl font-bold text-white">{currentUser?.balance || 0}</span>
                         <span className="text-sm text-slate-400 mb-1">Juris</span>
                     </div>
                     {!currentUser?.isPremium && (
                         <button onClick={() => setShowPremiumModal(true)} className="w-full mt-3 bg-gradient-to-r from-amber-400 to-yellow-600 text-black text-xs font-bold py-2 rounded-lg hover:brightness-110 transition">
                             Seja Premium
                         </button>
                     )}
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-4">
                <p className="px-2 text-[10px] font-bold text-slate-500 uppercase mt-4 mb-2 hidden lg:block">Navegação</p>
                <button onClick={() => handleNavigate('market')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'market' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Globe className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Oportunidades</span>
                </button>
                <button onClick={() => handleNavigate('my-cases')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'my-cases' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Briefcase className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Meus Casos</span>
                </button>

                <p className="px-2 text-[10px] font-bold text-slate-500 uppercase mt-6 mb-2 hidden lg:block flex justify-between items-center">
                    Ferramentas Pro {!currentUser?.isPremium && <Lock className="w-3 h-3"/>}
                </p>
                <button onClick={() => handleNavigate('tool-crm')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'tool-crm' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Users className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">CRM & KYC</span>
                </button>
                <button onClick={() => handleNavigate('tool-docs')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'tool-docs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Folders className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Smart Docs</span>
                </button>
                <button onClick={() => handleNavigate('tool-writer')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'tool-writer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <PenTool className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Redator IA</span>
                </button>
                <button onClick={() => handleNavigate('tool-calc')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'tool-calc' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Calculator className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Calculadoras</span>
                </button>
                <button onClick={() => handleNavigate('tool-juris')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'tool-juris' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Scale className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Jurisprudência</span>
                </button>
                <button onClick={() => handleNavigate('tool-agenda')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'tool-agenda' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <Calendar className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Agenda</span>
                </button>
                <button onClick={() => handleNavigate('tool-intake')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'tool-intake' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <ClipboardList className="w-5 h-5"/>
                    <span className="hidden lg:block text-sm font-medium">Triagem</span>
                </button>

                <div className="mt-8 border-t border-slate-800 pt-4">
                    <button onClick={() => handleNavigate('notifications')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'notifications' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                        <Bell className="w-5 h-5"/>
                        <span className="hidden lg:block text-sm font-medium">Notificações</span>
                    </button>
                    <button onClick={() => handleNavigate('profile')} className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition ${view === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                        <Settings className="w-5 h-5"/>
                        <span className="hidden lg:block text-sm font-medium">Ajustes</span>
                    </button>
                     <button onClick={logout} className="w-full flex items-center space-x-3 p-2.5 rounded-lg text-red-400 hover:bg-red-900/20 transition mt-2">
                        <LogOut className="w-5 h-5"/>
                        <span className="hidden lg:block text-sm font-medium">Sair</span>
                    </button>
                </div>
            </nav>
        </div>

        {/* Lawyer Main Content */}
        <div className="flex-1 ml-20 lg:ml-64 p-8 overflow-y-auto">
             <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-xl font-bold text-slate-900 flex items-center">
                    {view === 'market' && <><Globe className="w-6 h-6 mr-2 text-indigo-600"/> Oportunidades em Aberto</>}
                    {view === 'my-cases' && <><Briefcase className="w-6 h-6 mr-2 text-indigo-600"/> Meus Casos Ativos</>}
                    {view.startsWith('tool') && <><Sparkles className="w-6 h-6 mr-2 text-indigo-600"/> Ferramentas Inteligentes</>}
                    {view === 'profile' && 'Meu Perfil'}
                    {view === 'notifications' && 'Central de Notificações'}
                </h1>
                <div className="flex items-center space-x-4">
                     <div className="text-right hidden md:block">
                         <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                         <div className="flex items-center justify-end space-x-1">
                             <p className="text-xs text-slate-500">OAB {currentUser?.oab}</p>
                             {currentUser?.isPremium && <Sparkles className="w-3 h-3 text-yellow-500"/>}
                         </div>
                     </div>
                     <img src={currentUser?.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="Avatar"/>
                </div>
            </header>
            {renderContent()}
        </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
    const { users, toggleLawyerVerification, togglePremiumStatus, logout } = useApp();
    const lawyers = users.filter(u => u.role === UserRole.LAWYER);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredLawyers = lawyers.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-slate-100 p-8 font-sans">
            <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center space-x-3">
                    <div className="bg-slate-900 p-2.5 rounded-lg">
                        <Lock className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Painel Administrativo</h1>
                        <p className="text-slate-500 text-sm">Controle Geral do Sistema</p>
                    </div>
                </div>
                <button onClick={logout} className="flex items-center text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-red-200">
                    <LogOut className="w-5 h-5 mr-2"/> Sair
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-bold text-slate-500 uppercase">Total Usuários</p>
                    <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-bold text-slate-500 uppercase">Advogados</p>
                    <p className="text-3xl font-bold text-slate-900">{lawyers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-bold text-slate-500 uppercase">Pendentes</p>
                    <p className="text-3xl font-bold text-amber-500">{lawyers.filter(l => !l.verified).length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-bold text-slate-500 uppercase">Assinantes PRO</p>
                    <p className="text-3xl font-bold text-indigo-600">{lawyers.filter(l => l.isPremium).length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-indigo-600"/>
                        Gestão de Advogados
                    </h2>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Buscar por nome..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                </div>
                
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Advogado</th>
                            <th className="p-4">OAB</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-center">Status Verificação</th>
                            <th className="p-4 text-center">Plano PRO</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLawyers.map(lawyer => (
                            <tr key={lawyer.id} className="hover:bg-slate-50 transition">
                                <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <img src={lawyer.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200"/>
                                        <span className="font-bold text-slate-900">{lawyer.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-slate-600">{lawyer.oab || 'N/A'}</td>
                                <td className="p-4 text-slate-600">{lawyer.email}</td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => toggleLawyerVerification(lawyer.id, !lawyer.verified)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition ${lawyer.verified ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                    >
                                        {lawyer.verified ? 'Verificado' : 'Pendente/Bloqueado'}
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => togglePremiumStatus(lawyer.id, !lawyer.isPremium)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center justify-center mx-auto ${lawyer.isPremium ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                    >
                                        {lawyer.isPremium ? <><Sparkles className="w-3 h-3 mr-1"/> Ativo</> : 'Básico'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
