
export enum UserRole {
  CLIENT = 'CLIENT',
  LAWYER = 'LAWYER',
  ADMIN = 'ADMIN'
}

export enum CaseStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  verified?: boolean;
  isPremium?: boolean;
  oab?: string;
  specialties?: string[];
  phone?: string;
  bio?: string;
  balance?: number;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
}

export interface Case {
  id: string;
  clientId: string;
  lawyerId?: string;
  title: string;
  description: string;
  area: string;
  status: CaseStatus;
  city?: string;
  uf?: string;
  createdAt: string;
  messages: Message[];
  price?: number;
  complexity?: 'Baixa' | 'Média' | 'Alta';
  isPaid?: boolean;
  feedback?: {
    rating: number;
    comment: string;
  };
  interestedLawyers?: User[]; // Lista de advogados que manifestaram interesse
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export interface DashboardStats {
  activeCases: number;
  completedCases: number;
  totalRevenue?: number; 
  pendingVerifications?: number; 
}

// --- PRO TOOLS INTERFACES ---

// Tool 1: Smart Docs
export interface SmartDoc {
  id: string;
  lawyerId: string;
  clientId?: string; // Link opcional com CRM
  clientName?: string; // Helper para UI
  name: string;
  type: 'Peticao' | 'Contrato' | 'Sentenca' | 'Procuracao' | 'Outros';
  tags: string[];
  version: number;
  date: string;
  size: string;
  url?: string;
}

// Tool 2: Jurisprudence
export interface JurisprudenceResult {
  id: string;
  court: string;
  summary: string;
  outcome: 'Favorável' | 'Desfavorável' | 'Parcial';
  relevance: number; // 0-100
  date: string;
}

// Tool 3: Draft Creator
export interface DraftConfig {
  type: string;
  clientName: string;
  opposingParty: string;
  facts: string;
  tone: 'Formal' | 'Agressivo' | 'Conciliador' | 'Técnico';
}

// Tool 4: Smart Agenda
export interface AgendaItem {
  id: string;
  lawyerId: string;
  title: string;
  description?: string;
  date: string; // ISO
  type: 'Judicial' | 'Administrativo' | 'Interno' | 'Diligencia';
  urgency: 'Alta' | 'Média' | 'Baixa';
  clientId?: string;
  clientName?: string; // Helper UI
  status: 'PENDING' | 'DONE';
}

// Tool 5: CRM / KYC (Atualizado para DB Real)
export interface CRMProfile {
  id: string;
  lawyerId: string;
  name: string;
  type: 'PF' | 'PJ';
  cpf_cnpj?: string;
  rg?: string;
  email?: string;
  phone?: string;
  address?: string;
  profession?: string;
  civil_status?: string;
  riskScore: 'Baixo' | 'Médio' | 'Alto';
  status: 'Ativo' | 'Prospecção' | 'Inativo';
  notes?: string;
  createdAt: string;
}

// Tool 6: Intake
export interface IntakeSession {
  id: string;
  clientName: string;
  area: string;
  urgency: string;
  summary: string;
  suggestedAction: string;
  timestamp: string;
}

// Tool 7: Calculators
export interface SavedCalculation {
    id: string;
    lawyerId: string;
    category: string;
    type: string;
    title: string;
    inputData: any;
    resultData: any;
    createdAt: string;
}