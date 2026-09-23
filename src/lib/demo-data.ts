import type { Campaign, Task } from "./types";

export const tasks: Task[] = [
  { id: "t1", title: "Finalizar roteiro skincare 30s", meta: "Campanha • entregar hoje", done: false, tone: "urgent" },
  { id: "t2", title: "Gravar 3 hooks alternativos", meta: "Studio • bloco de gravação", done: false, tone: "today" },
  { id: "t3", title: "Cobrar retorno da marca Aurora", meta: "CRM • follow-up há 4 dias", done: false, tone: "today" },
  { id: "t4", title: "Selecionar 2 vídeos para portfólio", meta: "Portfólio • beauty", done: true, tone: "normal" },
];

export const campaigns: Campaign[] = [
  { id: "c1", brand: "Lumière", title: "Sérum de vitamina C", deadline: "24 set", status: "Edição", fee: 650, deliverables: "2 vídeos 30s + 4 hooks", usage: "Orgânico 90 dias", revisions: 1, payment: "Parcial" },
  { id: "c2", brand: "Movi", title: "Conjunto fitness", deadline: "27 set", status: "Roteiro", fee: 900, deliverables: "3 vídeos verticais", usage: "Orgânico + Ads 30 dias", revisions: 2, payment: "Pendente" },
  { id: "c3", brand: "Casa Nuvem", title: "Organizador modular", deadline: "02 out", status: "Briefing", fee: 500, deliverables: "1 vídeo 45s + 5 fotos", usage: "Orgânico 180 dias", revisions: 1, payment: "Pendente" },
];

export const brands = [
  { name: "Lumière", category: "Beauty", stage: "Fechado", value: 650, next: "Entrega 24/09" },
  { name: "Movi", category: "Fitness", stage: "Fechado", value: 900, next: "Roteiro" },
  { name: "Aurora", category: "Casa", stage: "Follow-up", value: 700, next: "Cobrar hoje" },
  { name: "Mimo Pet", category: "Pet", stage: "Proposta", value: 550, next: "Aguardar resposta" },
  { name: "Nuage", category: "Lifestyle", stage: "Quero contatar", value: 0, next: "Pesquisar contato" },
];

export const products = [
  { name: "Armani My Way", category: "Beauty", owned: true, cost: 0, ideas: 7, priority: "Alta" },
  { name: "DJI Osmo Action 4", category: "Tech", owned: true, cost: 0, ideas: 6, priority: "Alta" },
  { name: "Look fitness azul-bebê", category: "Fitness", owned: true, cost: 0, ideas: 5, priority: "Média" },
  { name: "Box de beleza mensal", category: "Beauty", owned: false, cost: 169, ideas: 4, priority: "Baixa" },
];
