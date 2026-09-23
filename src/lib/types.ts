export type NavKey =
  | "hoje"
  | "studio"
  | "ideias"
  | "trabalhos"
  | "marcas"
  | "portfolio"
  | "financeiro"
  | "calendario"
  | "review";

export type Task = {
  id: string;
  title: string;
  meta: string;
  done: boolean;
  tone: "urgent" | "today" | "normal";
};

export type Campaign = {
  id: string;
  brand: string;
  title: string;
  deadline: string;
  status: "Briefing" | "Roteiro" | "Gravação" | "Edição" | "Aprovação" | "Concluído";
  fee: number;
  deliverables: string;
  usage: string;
  revisions: number;
  payment: "Pendente" | "Parcial" | "Pago";
};

export type LiveTask = {
  id: string;
  title: string;
  dueAt: string | null;
  priority: string;
  completed: boolean;
};

export type LiveBrand = {
  id: string;
  name: string;
  category: string | null;
  stage: string;
  value: number;
  next: string | null;
};

export type LiveProduct = {
  id: string;
  name: string;
  category: string | null;
  owned: boolean;
  cost: number;
  ideas: number;
  priority: string;
};

export type LiveCampaign = {
  id: string;
  brand: string;
  title: string;
  deadline: string | null;
  status: string;
  fee: number;
  deliverables: unknown;
  usageRights: unknown;
  revisions: number;
  paymentStatus: string;
};

export type LivePortfolioItem = {
  id: string;
  title: string;
  category: string | null;
  skillTag: string | null;
  mediaPath: string | null;
  isPublic: boolean;
  permissionStatus: string;
};

export type LiveWorkspaceData = {
  userId: string;
  displayName: string;
  workspaceId: string;
  workspaceName: string;
  monthlyGoal: number;
  tasks: LiveTask[];
  brands: LiveBrand[];
  products: LiveProduct[];
  campaigns: LiveCampaign[];
  portfolio: LivePortfolioItem[];
};
