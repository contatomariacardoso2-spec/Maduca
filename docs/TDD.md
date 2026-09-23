# TDD — Maduca UGC OS

## 1. Objetivo

Construir um sistema operacional pessoal para UGC Creators que reduza dispersão e conecte o ciclo completo:

**ideia → briefing → roteiro → gravação → edição → aprovação → entrega → pagamento → portfólio → aprendizado → próxima venda**.

O produto deve responder rapidamente:

1. O que eu preciso fazer agora?
2. O que está perto de vencer?
3. Qual marca precisa de follow-up?
4. Quanto vou receber e quando?
5. O que já tenho em casa que pode virar conteúdo?
6. Meu portfólio está cobrindo quais habilidades e categorias?
7. Quais condições comerciais eu ainda não confirmei?

## 2. Princípios de UX

- Próximo passo > excesso de informação.
- A home não é um relatório; é uma central de ação.
- Todo card de campanha deve explicitar prazo, entregáveis, revisões, uso e pagamento.
- Permuta nunca deve ser somada a faturamento em dinheiro.
- Produto recebido deve ser tratado como ativo criativo e custo/oportunidade, não como “pagamento” automaticamente.
- Conteúdo orgânico pessoal e UGC pago podem compartilhar material bruto, mas têm publicação e direitos separados.
- Portfolio item deve ter permissão pública explícita ou status “não confirmado”.

## 3. Módulos

### Hoje
- Próximas tarefas
- Deadlines
- Follow-ups
- Pagamentos vencendo
- Indicadores curtos
- Atalho para Studio

### Estúdio
- Briefing estruturado
- Perguntas faltantes
- Gerador de conceito
- Hooks
- Script
- Shot list
- Checklist de props
- Status de gravação
- Versões
- Exportação

### Ideias & produtos
- Inventário pessoal
- Produtos recebidos/comprados
- Custo de aquisição
- Potencial criativo
- Ideias ligadas ao produto
- Análise de box: custo total, frete, número de vídeos planejados, custo por vídeo planejado
- Lacunas do portfólio

### Campanhas
- Marca
- Briefing
- Fee
- Escopo
- Prazo
- Direitos de uso
- Exclusividade
- Raw files
- Revisões
- Aprovação
- Pagamento
- Histórico

### CRM
Pipeline:
- Quero contatar
- Pitch preparado
- Proposta enviada
- Follow-up
- Negociação
- Fechado
- Perdido / pausar

### Portfólio
- Categoria
- Formato
- Skill tag
- Métrica/objetivo do criativo
- Link de mídia
- Permissão de exibição
- Link público

### Financeiro
- Fee
- Entrada
- Saldo
- Despesas
- Permutas
- Horas por campanha
- R$/hora efetiva
- Receita por categoria
- Meta mensal
- Aging de recebíveis

### Calendário
- Blocos de roteirização, gravação, edição, outreach e review
- Respeitar compromissos externos
- Sugestão de batching

### Review semanal
- O que saiu do papel
- O que funcionou
- O que travou
- O que testar
- Placar produção/comercial/portfólio

## 4. Modelo de dados

Ver `supabase/schema.sql`.

Entidades centrais: user/profile, workspace, brand, campaign, task, product, content_idea, portfolio_item, transaction, weekly_review.

## 5. IA

### Briefing Copilot
Entrada: briefing bruto + metadados da campanha.
Saída estruturada:
- resumo
- lacunas / perguntas
- proposta de conceito
- 3–5 hooks
- roteiro em blocos de tempo
- shot list
- props
- checklist de compliance

### Guardrails
- IA nunca inventa característica objetiva do produto.
- Claims de saúde/beleza devem ser marcados para conferência.
- Não assumir que marca autorizou Ads, whitelisting, exclusividade ou portfolio.
- Diferenciar sugestão criativa de obrigação contratual.
- Preservar briefing original imutável no histórico.

## 6. Roadmap

### V0 — presente
Front-end navegável com dados demo, direção visual e lógica de produto.

### V1 — persistência
Supabase Auth, Postgres, CRUD real, uploads, RLS, storage.

### V1.1 — comercial
Propostas, templates, follow-up, pagamentos, contrato/resumo de direitos.

### V1.2 — Studio IA
Briefing Copilot, script, shot list, versões e biblioteca de hooks.

### V1.3 — Portfólio público
Página pública, coleções por categoria, tracking de visualizações.

### V2 — Creator Intelligence
Benchmarks pessoais, taxa de resposta, taxa de fechamento, valor/hora, desempenho de formatos e recomendação de portfólio.

## 7. Critérios de qualidade

- Mobile-first aceitável; desktop excelente.
- Nenhuma informação comercial crítica escondida apenas em nota livre.
- Estados vazios instrutivos.
- Acessibilidade: contraste, foco, labels, teclado.
- Datas em timezone do usuário.
- Valores monetários com moeda configurável.
- Nenhum segredo/API key no cliente ou repositório.
- RLS obrigatório antes de ambiente multiusuário.
