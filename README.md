# Maduca — UGC OS

**Maduca** é um workspace para organizar a operação de uma UGC Creator de ponta a ponta: ideias, produtos, briefings, roteiro, gravação, campanhas, CRM de marcas, propostas, direitos de uso, portfólio, finanças, calendário e review semanal.

## Produção

**URL:** https://maduca.vercel.app

O deploy de produção está conectado ao GitHub e é atualizado automaticamente pela Vercel a partir da branch `main`.

## Status atual

A V1 está conectada ao projeto Supabase **Maduca** (`wpdsbrlmrqvkeklnemrz`) e inclui:

- Supabase Auth com cadastro/login por email e senha
- Perfil + workspace criados automaticamente no primeiro cadastro
- Postgres com 10 tabelas de domínio
- Row Level Security em todas as tabelas públicas
- CRUD persistente para tarefas, produtos, marcas e campanhas
- Review semanal persistente
- Storage privado `ugc-assets` para vídeos e imagens
- Portfólio com mídia privada por padrão
- Tipos TypeScript gerados diretamente do schema real
- GitHub Actions com `npm ci`, typecheck e `next build`
- Studio com endpoint server-side preparado para Vercel AI Gateway

O Supabase Security Advisor está sem findings. Os índices de foreign key recomendados também já foram aplicados.

## Visão do produto

A pergunta central do Maduca é: **“qual é o próximo passo para transformar uma ideia em conteúdo, portfólio melhor ou trabalho pago?”**

A interface inclui:

- Dashboard “Hoje” com prioridades, prazos e métricas
- Estúdio de criação com briefing → plano de gravação
- Biblioteca de ideias e inventário de produtos
- Campanhas e entregáveis
- Guardrails comerciais: uso, exclusividade, raw files, revisões e pagamento
- CRM visual de marcas e propostas
- Portfólio público/privado
- Financeiro
- Calendário
- Review semanal

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Supabase Auth + Postgres + Storage + RLS
- Vercel AI SDK / AI Gateway para o Copilot
- CSS próprio
- GitHub Actions

## Rodando localmente

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Abra `http://localhost:3000`.

A publishable key do Supabase pode existir no cliente; a segurança dos dados é feita pelas policies de RLS. **Nunca** coloque `service_role`, secret key ou senha do banco em variáveis `NEXT_PUBLIC_*` ou no repositório.

## IA

O endpoint `/api/ai/briefing` só aceita usuários autenticados. Para habilitar geração real fora de um ambiente Vercel com OIDC, configure no ambiente do servidor:

```
AI_GATEWAY_API_KEY=...
```

O briefing é enviado à IA somente quando a creator aciona explicitamente o Copilot. O prompt impede suposições sobre claims de produto, direitos de Ads, exclusividade, raw files e autorização de portfólio.

## Estrutura

- `src/app` — App Router, login, API e estilos
- `src/components/MaducaLiveApp.tsx` — workspace conectado ao Supabase
- `src/components/MaducaApp.tsx` — fallback/demo quando não há env do Supabase
- `src/lib/database.types.ts` — tipos gerados do banco real
- `src/lib/supabase` — clientes browser/server e refresh de sessão
- `supabase/schema.sql` — schema de produção versionado
- `docs/TDD.md` — especificação técnica e de produto
- `ai-harness/` — contexto, guardrails e backlog para agentes

## Próximos marcos

1. Ativar o AI Gateway no ambiente de produção para o Copilot gerar planos reais
2. Validar o link real de confirmação de email com uma caixa postal acessível
3. Portal público de portfólio com URLs assinadas/publicação controlada
4. Propostas em PDF, lembretes e automações
5. Analytics de receita, conversão e produtividade

## Produto

A interface foi desenhada para uma creator que concilia UGC com outras áreas da vida. O Maduca prioriza clareza operacional e reduz “tarefas fantasmas”: follow-ups esquecidos, direito de uso mal registrado, pagamento atrasado, arquivos sem organização e compras de produto sem retorno criativo.
