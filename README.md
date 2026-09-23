# Maduca — UGC OS

**Maduca** é um workspace para organizar a operação de uma UGC Creator de ponta a ponta: ideias, produtos, briefings, roteiro, gravação, campanhas, CRM de marcas, propostas, direitos de uso, portfólio, finanças, calendário e review semanal.

## Visão do produto

A pergunta central do Maduca é: **“qual é o próximo passo para transformar uma ideia em conteúdo, portfólio melhor ou trabalho pago?”**

A primeira versão inclui:

- Dashboard “Hoje” com prioridades, prazos e métricas
- Estúdio de criação com briefing → plano de gravação
- Biblioteca de ideias e inventário de produtos
- Campanhas e entregáveis
- Guardrails comerciais: uso, exclusividade, raw files, revisões e pagamento
- CRM visual de marcas e propostas
- Portfólio público/privado
- Financeiro com valor/hora e pagamentos
- Calendário criativo semanal
- Review semanal com aprendizado contínuo

## Stack

- Next.js App Router
- React + TypeScript
- CSS próprio (sem dependência de UI kit)
- Dados demo locais nesta primeira entrega
- Estrutura de banco Supabase em `supabase/schema.sql`

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Próximas integrações

1. Supabase Auth + Postgres + Storage
2. Persistência real por workspace
3. Upload de vídeos e thumbnails
4. IA real para briefing → roteiro/shot list
5. Portal público de portfólio
6. Envio de proposta em PDF
7. Lembretes e automações
8. Analytics de receita, conversão e produtividade

## Estrutura

- `src/app` — App Router e estilos globais
- `src/components/MaducaApp.tsx` — interface funcional da V0
- `src/lib` — tipos e dados demo
- `supabase/schema.sql` — modelo de dados planejado
- `docs/TDD.md` — especificação técnica e de produto
- `ai-harness/` — instruções para evolução assistida por agente

## Produto

A interface foi desenhada para uma creator que concilia UGC com outras áreas da vida. O Maduca prioriza clareza operacional e reduz “tarefas fantasmas”: follow-ups esquecidos, direito de uso mal registrado, pagamento atrasado, arquivos sem organização e compras de produto sem retorno criativo.
