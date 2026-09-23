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
