"use client";

import { useMemo, useState } from "react";
import AssetUploader from "@/components/AssetUploader";
import { createClient } from "@/lib/supabase/client";
import type {
  LiveBrand,
  LiveCampaign,
  LivePortfolioItem,
  LiveProduct,
  LiveTask,
  LiveWorkspaceData,
  NavKey,
} from "@/lib/types";

const nav: Array<{ key: NavKey; label: string; icon: string }> = [
  { key: "hoje", label: "Hoje", icon: "⌂" },
  { key: "studio", label: "Estúdio", icon: "✦" },
  { key: "ideias", label: "Ideias & produtos", icon: "◫" },
  { key: "trabalhos", label: "Trabalhos", icon: "▣" },
  { key: "marcas", label: "Marcas & propostas", icon: "◎" },
  { key: "portfolio", label: "Portfólio", icon: "◇" },
  { key: "financeiro", label: "Dinheiro", icon: "$" },
  { key: "calendario", label: "Calendário", icon: "□" },
  { key: "review", label: "Review semanal", icon: "↻" },
];

const brandStages = ["quero_contatar", "proposta", "follow_up", "negociacao", "fechado"];
const campaignStages = ["briefing", "roteiro", "gravacao", "edicao", "aprovacao", "concluido"];

const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const dateLabel = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value))
    : "Sem prazo";

const pretty = (value: string) =>
  value.replaceAll("_", " ").replace(/(^|\s)\S/g, (s) => s.toUpperCase());

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Header({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export default function MaducaLiveApp({ initial }: { initial: LiveWorkspaceData }) {
  const [active, setActive] = useState<NavKey>("hoje");
  const [tasks, setTasks] = useState(initial.tasks);
  const [brands, setBrands] = useState(initial.brands);
  const [products, setProducts] = useState(initial.products);
  const [campaigns, setCampaigns] = useState(initial.campaigns);
  const [portfolio, setPortfolio] = useState(initial.portfolio);
  const [toast, setToast] = useState("");

  const revenue = campaigns.reduce((sum, item) => sum + item.fee, 0);
  const completed = tasks.filter((item) => item.completed).length;
  const pending = campaigns
    .filter((item) => item.paymentStatus !== "paid")
    .reduce((sum, item) => sum + item.fee, 0);

  const notify = (value: string) => {
    setToast(value);
    window.setTimeout(() => setToast(""), 2600);
  };

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const screen = useMemo(() => {
    const common = {
      workspaceId: initial.workspaceId,
      userId: initial.userId,
      notify,
    };

    switch (active) {
      case "hoje":
        return (
          <LiveToday
            tasks={tasks}
            setTasks={setTasks}
            brands={brands}
            campaigns={campaigns}
            revenue={revenue}
            pending={pending}
            completed={completed}
            setActive={setActive}
            {...common}
          />
        );
      case "studio":
        return <LiveStudio />;
      case "ideias":
        return <LiveProducts products={products} setProducts={setProducts} {...common} />;
      case "trabalhos":
        return <LiveCampaigns campaigns={campaigns} setCampaigns={setCampaigns} {...common} />;
      case "marcas":
        return <LiveBrands brands={brands} setBrands={setBrands} {...common} />;
      case "portfolio":
        return (
          <LivePortfolio
            items={portfolio}
            setItems={setPortfolio}
            userId={initial.userId}
            workspaceId={initial.workspaceId}
            notify={notify}
          />
        );
      case "financeiro":
        return <LiveMoney campaigns={campaigns} goal={initial.monthlyGoal} />;
      case "calendario":
        return <LiveCalendar campaigns={campaigns} tasks={tasks} />;
      default:
        return <LiveReview workspaceId={initial.workspaceId} notify={notify} />;
    }
  }, [active, tasks, brands, products, campaigns, portfolio, revenue, pending, completed, initial]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">M</span>
          <div>
            <strong>Maduca</strong>
            <small>UGC operating system</small>
          </div>
        </div>

        <div className="profile">
          <span>{initial.displayName.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{initial.displayName}</strong>
            <small>{initial.workspaceName}</small>
          </div>
        </div>

        <nav>
          <small className="nav-title">WORKSPACE</small>
          {nav.map((item) => (
            <button
              key={item.key}
              className={active === item.key ? "nav active" : "nav"}
              onClick={() => setActive(item.key)}
            >
              <i>{item.icon}</i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="goal">
          <div>
            <span>Meta do mês</span>
            <strong>
              {brl(revenue)} / {brl(initial.monthlyGoal)}
            </strong>
          </div>
          <div className="progress">
            <i
              style={{
                width: `${Math.min(
                  100,
                  initial.monthlyGoal > 0 ? (revenue / initial.monthlyGoal) * 100 : 0,
                )}%`,
              }}
            />
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="search">
            ● <span>Dados sincronizados com Supabase</span>
          </div>
          <div>
            <button className="secondary" onClick={signOut}>Sair</button>
            <button className="primary" onClick={() => setActive("studio")}>✦ Copilot</button>
          </div>
        </header>

        <div className="content">{screen}</div>
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}

function LiveToday({
  tasks,
  setTasks,
  brands,
  campaigns,
  revenue,
  pending,
  completed,
  setActive,
  workspaceId,
  notify,
}: {
  tasks: LiveTask[];
  setTasks: React.Dispatch<React.SetStateAction<LiveTask[]>>;
  brands: LiveBrand[];
  campaigns: LiveCampaign[];
  revenue: number;
  pending: number;
  completed: number;
  setActive: (key: NavKey) => void;
  workspaceId: string;
  notify: (message: string) => void;
}) {
  const supabase = createClient();

  async function addTask() {
    const title = window.prompt("Qual é a próxima ação?");
    if (!title?.trim()) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert({ workspace_id: workspaceId, title: title.trim(), priority: "normal" })
      .select("id,title,due_at,priority,completed_at")
      .single();
    if (error) return notify(error.message);
    setTasks((current) => [
      ...current,
      {
        id: data.id,
        title: data.title,
        dueAt: data.due_at,
        priority: data.priority || "normal",
        completed: Boolean(data.completed_at),
      },
    ]);
  }

  async function toggleTask(task: LiveTask) {
    const completedAt = task.completed ? null : new Date().toISOString();
    const { error } = await supabase
      .from("tasks")
      .update({ completed_at: completedAt })
      .eq("id", task.id);
    if (error) return notify(error.message);
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  async function removeTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) return notify(error.message);
    setTasks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <div className="hero">
        <div>
          <span className="eyebrow">HOJE • WORKSPACE REAL</span>
          <h1>Boa tarde, creator <em>✦</em></h1>
          <p>O que está aqui vem do seu banco — não é mais dado demonstrativo.</p>
        </div>
        <div className="ring">
          <strong>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</strong>
          <span>do fluxo</span>
        </div>
      </div>

      <div className="metrics">
        <Metric label="Receita em campanhas" value={brl(revenue)} foot="fees cadastrados" />
        <Metric label="A receber" value={brl(pending)} foot="não marcados como pagos" />
        <Metric label="Campanhas ativas" value={String(campaigns.filter((c) => c.status !== "concluido").length)} foot="no pipeline" />
        <Metric label="Marcas no CRM" value={String(brands.length)} foot="contatos persistentes" />
      </div>

      <div className="grid2">
        <Card>
          <div className="table-head">
            <div>
              <h2>Próximos passos</h2>
              <p className="muted">CRUD PERSISTENTE</p>
            </div>
            <button className="secondary" onClick={addTask}>＋ Tarefa</button>
          </div>
          <div className="tasks">
            {tasks.length === 0 && <p>Nenhuma tarefa ainda. Crie a primeira acima.</p>}
            {tasks.map((task) => (
              <div className={task.completed ? "task done" : "task"} key={task.id}>
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} />
                <span className={`dot ${task.priority === "urgent" ? "urgent" : "normal"}`} />
                <div>
                  <strong>{task.title}</strong>
                  <small>{task.dueAt ? dateLabel(task.dueAt) : "Sem prazo"}</small>
                </div>
                <button className="row-delete" onClick={() => removeTask(task.id)} aria-label="Excluir">×</button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="insight">
          <span className="spark">✦</span>
          <p className="muted">MADUCA COPILOT</p>
          <h2>Transforme qualquer briefing em plano de gravação.</h2>
          <p>Agora o Studio chama uma IA real no servidor, mantendo o briefing original intacto.</p>
          <button onClick={() => setActive("studio")}>Abrir Studio →</button>
        </Card>
      </div>
    </>
  );
}

function Metric({ label, value, foot }: { label: string; value: string; foot: string }) {
  return (
    <Card>
      <small>{label}</small>
      <div className="metric">{value}</div>
      <span className="metric-foot">{foot}</span>
    </Card>
  );
}

type AiPlan = {
  summary: string;
  missingQuestions: string[];
  concept: string;
  hooks: string[];
  script: Array<{ time: string; line: string; visual: string }>;
  shots: Array<{ label: string; framing: string; notes: string }>;
  props: string[];
  complianceChecks: string[];
};

function LiveStudio() {
  const [brief, setBrief] = useState("");
  const [plan, setPlan] = useState<AiPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const response = await fetch("/api/ai/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief,
          format: "UGC vertical 9:16",
          duration: "30 segundos",
          objective: "Conversão",
          tone: "Natural e próximo",
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Falha ao gerar plano.");
      setPlan(json.plan);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao gerar plano.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        eyebrow="ESTÚDIO COM IA"
        title="Briefing → plano de gravação."
        description="A IA organiza; você continua decidindo o que é criativo, factual e contratualmente permitido."
      />
      <div className="studio">
        <Card>
          <label className="field">
            BRIEFING ORIGINAL
            <textarea
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder="Cole aqui o briefing da marca, entregáveis, tom, claims autorizados e observações…"
            />
          </label>
          <button className="ai" disabled={loading || brief.trim().length < 20} onClick={generate}>
            {loading ? "✦ Organizando briefing…" : "✦ Criar plano com IA"}
          </button>
          {error && <div className="auth-error">{error}</div>}
        </Card>
        <Card className="copilot">
          <p className="muted">MADUCA COPILOT</p>
          {!plan ? (
            <div className="empty">
              <span>✦</span>
              <h3>O plano aparece aqui.</h3>
              <p>Claims e direitos ausentes viram perguntas, não suposições.</p>
            </div>
          ) : (
            <div className="plan">
              <section><small>RESUMO</small><p>{plan.summary}</p></section>
              <section><small>CONCEITO</small><h3>{plan.concept}</h3></section>
              <section><small>PERGUNTAS FALTANTES</small><ul>{plan.missingQuestions.map((x) => <li key={x}>{x}</li>)}</ul></section>
              <section><small>HOOKS</small><ol>{plan.hooks.map((x) => <li key={x}>{x}</li>)}</ol></section>
              <section>
                <small>ROTEIRO</small>
                {plan.script.map((row, index) => (
                  <div className="shot" key={index}>
                    <b>{row.time}</b><span>{row.line}</span><small>{row.visual}</small>
                  </div>
                ))}
              </section>
              <section>
                <small>SHOT LIST</small>
                {plan.shots.map((row, index) => (
                  <div className="shot" key={index}>
                    <b>{String(index + 1).padStart(2, "0")}</b><span>{row.label}</span><small>{row.framing} • {row.notes}</small>
                  </div>
                ))}
              </section>
              <div className="warning">⚠ {plan.complianceChecks.join(" • ")}</div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function LiveProducts({
  products,
  setProducts,
  workspaceId,
  notify,
}: {
  products: LiveProduct[];
  setProducts: React.Dispatch<React.SetStateAction<LiveProduct[]>>;
  workspaceId: string;
  notify: (message: string) => void;
}) {
  const supabase = createClient();

  async function add() {
    const name = window.prompt("Qual produto entra no seu inventário?");
    if (!name?.trim()) return;
    const category = window.prompt("Categoria? (Beauty, Tech, Casa, Pet…)") || "";
    const { data, error } = await supabase
      .from("products")
      .insert({ workspace_id: workspaceId, name: name.trim(), category, owned: true })
      .select("id,name,category,owned,acquisition_cost,creative_potential,priority")
      .single();
    if (error) return notify(error.message);
    setProducts((current) => [{
      id: data.id, name: data.name, category: data.category, owned: data.owned,
      cost: Number(data.acquisition_cost || 0), ideas: Number(data.creative_potential || 0),
      priority: data.priority || "medium",
    }, ...current]);
  }

  async function toggleOwned(product: LiveProduct) {
    const { error } = await supabase.from("products").update({ owned: !product.owned }).eq("id", product.id);
    if (error) return notify(error.message);
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, owned: !item.owned } : item));
  }

  async function remove(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return notify(error.message);
    setProducts((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <Header eyebrow="BANCO CRIATIVO" title="Ideias & produtos" description="Seu inventário real, pronto para virar conteúdo." action={<button className="primary" onClick={add}>＋ Produto</button>} />
      <Card>
        <div className="data-table">
          <div className="tr th"><span>Produto</span><span>Categoria</span><span>Status</span><span>Potencial</span><span>Ações</span></div>
          {products.map((product) => (
            <div className="tr" key={product.id}>
              <span><strong>{product.name}</strong></span>
              <span>{product.category || "—"}</span>
              <span>{product.owned ? "Já tenho" : "Quero comprar"}</span>
              <span>{product.ideas} ideias</span>
              <span className="row-actions"><button onClick={() => toggleOwned(product)}>Alternar</button><button onClick={() => remove(product.id)}>Excluir</button></span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function LiveBrands({
  brands,
  setBrands,
  workspaceId,
  notify,
}: {
  brands: LiveBrand[];
  setBrands: React.Dispatch<React.SetStateAction<LiveBrand[]>>;
  workspaceId: string;
  notify: (message: string) => void;
}) {
  const supabase = createClient();

  async function add() {
    const name = window.prompt("Nome da marca?");
    if (!name?.trim()) return;
    const category = window.prompt("Categoria?") || "";
    const { data, error } = await supabase
      .from("brands")
      .insert({ workspace_id: workspaceId, name: name.trim(), category, stage: "quero_contatar" })
      .select("id,name,category,stage,estimated_value,next_action")
      .single();
    if (error) return notify(error.message);
    setBrands((current) => [...current, {
      id: data.id, name: data.name, category: data.category, stage: data.stage,
      value: Number(data.estimated_value || 0), next: data.next_action,
    }]);
  }

  async function advance(brand: LiveBrand) {
    const currentIndex = brandStages.indexOf(brand.stage);
    const next = brandStages[(currentIndex + 1) % brandStages.length];
    const { error } = await supabase.from("brands").update({ stage: next }).eq("id", brand.id);
    if (error) return notify(error.message);
    setBrands((items) => items.map((item) => item.id === brand.id ? { ...item, stage: next } : item));
  }

  async function remove(id: string) {
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) return notify(error.message);
    setBrands((items) => items.filter((item) => item.id !== id));
  }

  return (
    <>
      <Header eyebrow="CRM PERSISTENTE" title="Marcas & propostas" description="Atualize o funil e pare de perder follow-up." action={<button className="primary" onClick={add}>＋ Marca</button>} />
      <div className="kanban">
        {brandStages.map((stage) => (
          <div className="kanban-col" key={stage}>
            <div className="kanban-title"><strong>{pretty(stage)}</strong><span>{brands.filter((b) => b.stage === stage).length}</span></div>
            {brands.filter((b) => b.stage === stage).map((brand) => (
              <Card key={brand.id}>
                <div className="brand-row compact"><span className="avatar">{brand.name[0]}</span><div><strong>{brand.name}</strong><small>{brand.category || "Sem categoria"}</small></div></div>
                {brand.value > 0 && <div className="proposal">{brl(brand.value)}</div>}
                <div className="row-actions"><button onClick={() => advance(brand)}>Avançar →</button><button onClick={() => remove(brand.id)}>Excluir</button></div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function LiveCampaigns({
  campaigns,
  setCampaigns,
  workspaceId,
  notify,
}: {
  campaigns: LiveCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<LiveCampaign[]>>;
  workspaceId: string;
  notify: (message: string) => void;
}) {
  const supabase = createClient();

  async function add() {
    const title = window.prompt("Nome da campanha/trabalho?");
    if (!title?.trim()) return;
    const feeInput = window.prompt("Fee em reais?") || "0";
    const fee = Number(feeInput.replace(",", ".")) || 0;
    const { data, error } = await supabase
      .from("campaigns")
      .insert({ workspace_id: workspaceId, title: title.trim(), fee, status: "briefing" })
      .select("id,title,status,fee,deadline,deliverables,usage_rights,included_revisions,payment_status")
      .single();
    if (error) return notify(error.message);
    setCampaigns((items) => [...items, {
      id: data.id, brand: "Sem marca", title: data.title, deadline: data.deadline,
      status: data.status, fee: Number(data.fee || 0), deliverables: data.deliverables,
      usageRights: data.usage_rights, revisions: Number(data.included_revisions || 0),
      paymentStatus: data.payment_status || "pending",
    }]);
  }

  async function advance(campaign: LiveCampaign) {
    const index = campaignStages.indexOf(campaign.status);
    const next = campaignStages[(index + 1) % campaignStages.length];
    const { error } = await supabase.from("campaigns").update({ status: next }).eq("id", campaign.id);
    if (error) return notify(error.message);
    setCampaigns((items) => items.map((item) => item.id === campaign.id ? { ...item, status: next } : item));
  }

  async function remove(id: string) {
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) return notify(error.message);
    setCampaigns((items) => items.filter((item) => item.id !== id));
  }

  return (
    <>
      <Header eyebrow="TRABALHOS" title="Campanhas reais" description="Status, fee, uso e revisões persistidos no banco." action={<button className="primary" onClick={add}>＋ Campanha</button>} />
      <div className="campaigns">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <div className="campaign-top">
              <div><Pill tone="good">{pretty(campaign.status)}</Pill><h3>{campaign.brand}</h3><p>{campaign.title}</p></div>
              <strong>{brl(campaign.fee)}</strong>
            </div>
            <div className="campaign-meta">
              <span><small>Entrega</small><strong>{dateLabel(campaign.deadline)}</strong></span>
              <span><small>Pagamento</small><strong>{pretty(campaign.paymentStatus)}</strong></span>
            </div>
            <div className="details">
              <p><span>Revisões</span>{campaign.revisions}</p>
              <p><span>Uso</span>{JSON.stringify(campaign.usageRights || {})}</p>
            </div>
            <div className="row-actions"><button onClick={() => advance(campaign)}>Avançar status</button><button onClick={() => remove(campaign.id)}>Excluir</button></div>
          </Card>
        ))}
      </div>
    </>
  );
}

function LivePortfolio({
  items,
  setItems,
  userId,
  workspaceId,
  notify,
}: {
  items: LivePortfolioItem[];
  setItems: React.Dispatch<React.SetStateAction<LivePortfolioItem[]>>;
  userId: string;
  workspaceId: string;
  notify: (message: string) => void;
}) {
  const supabase = createClient();

  async function remove(item: LivePortfolioItem) {
    if (item.mediaPath) {
      const { error: storageError } = await supabase.storage
        .from("ugc-assets")
        .remove([item.mediaPath]);
      if (storageError) return notify(storageError.message);
    }

    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", item.id);
    if (error) return notify(error.message);

    setItems((current) => current.filter((entry) => entry.id !== item.id));
    notify("Mídia excluída.");
  }

  return (
    <>
      <Header eyebrow="PORTFÓLIO + STORAGE" title="Arquivos organizados com privacidade." description="Uploads entram em bucket privado; publicação pública exige uma etapa explícita." />
      <AssetUploader userId={userId} workspaceId={workspaceId} onUploaded={(item) => setItems((current) => [item, ...current])} />
      <div className="portfolio live-portfolio">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="thumb"><span>▣</span></div>
            <div className="portfolio-info">
              <div><h3>{item.title}</h3><p>{item.mediaPath || "sem arquivo"} • {item.category || "sem categoria"}</p></div>
              <div className="row-actions">
                <Pill tone={item.isPublic && item.permissionStatus === "granted" ? "good" : "warm"}>
                  {item.isPublic ? "Público" : "Privado"}
                </Pill>
                <button onClick={() => remove(item)}>Excluir</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function LiveMoney({ campaigns, goal }: { campaigns: LiveCampaign[]; goal: number }) {
  const total = campaigns.reduce((sum, item) => sum + item.fee, 0);
  const paid = campaigns.filter((c) => c.paymentStatus === "paid").reduce((sum, item) => sum + item.fee, 0);
  return (
    <>
      <Header eyebrow="FINANCEIRO" title="Dinheiro conectado às campanhas" description="Permuta continua separada de receita em dinheiro no modelo de dados." />
      <div className="metrics">
        <Metric label="Fees cadastrados" value={brl(total)} foot="campanhas no banco" />
        <Metric label="Recebido" value={brl(paid)} foot="status paid" />
        <Metric label="A receber" value={brl(total - paid)} foot="saldo operacional" />
        <Metric label="Meta mensal" value={brl(goal)} foot="configuração do workspace" />
      </div>
    </>
  );
}

function LiveCalendar({ campaigns, tasks }: { campaigns: LiveCampaign[]; tasks: LiveTask[] }) {
  const deadlines = [
    ...campaigns.filter((item) => item.deadline).map((item) => ({ label: item.title, date: item.deadline! })),
    ...tasks.filter((item) => item.dueAt && !item.completed).map((item) => ({ label: item.title, date: item.dueAt! })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <Header eyebrow="CALENDÁRIO" title="Prazos vindos do banco" description="A próxima integração poderá sincronizar estes blocos com um calendário externo." />
      <Card>
        {deadlines.length === 0 && <p>Nenhum prazo cadastrado ainda.</p>}
        {deadlines.map((item) => (
          <div className="profit" key={item.date + item.label}>
            <strong>{item.label}</strong><span>{new Date(item.date).toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </Card>
    </>
  );
}

function LiveReview({ workspaceId, notify }: { workspaceId: string; notify: (message: string) => void }) {
  const [wins, setWins] = useState("");
  const [worked, setWorked] = useState("");
  const [blockers, setBlockers] = useState("");
  const [experiments, setExperiments] = useState("");

  async function save() {
    const supabase = createClient();
    const today = new Date();
    const monday = new Date(today);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - ((day + 6) % 7));
    const weekStart = monday.toISOString().slice(0, 10);

    const { error } = await supabase.from("weekly_reviews").upsert(
      {
        workspace_id: workspaceId,
        week_start: weekStart,
        wins,
        worked,
        blockers,
        experiments,
      },
      { onConflict: "workspace_id,week_start" },
    );

    notify(error ? error.message : "Review semanal salvo.");
  }

  return (
    <>
      <Header eyebrow="REVIEW SEMANAL" title="Feche o ciclo e aprenda." description="Seu review também fica persistido." action={<button className="primary" onClick={save}>Salvar review</button>} />
      <div className="review-grid">
        <Card><b className="step">01</b><h3>O que saiu do papel?</h3><textarea value={wins} onChange={(e) => setWins(e.target.value)} /></Card>
        <Card><b className="step">02</b><h3>O que funcionou?</h3><textarea value={worked} onChange={(e) => setWorked(e.target.value)} /></Card>
        <Card><b className="step">03</b><h3>O que travou?</h3><textarea value={blockers} onChange={(e) => setBlockers(e.target.value)} /></Card>
        <Card><b className="step">04</b><h3>O que testar agora?</h3><textarea value={experiments} onChange={(e) => setExperiments(e.target.value)} /></Card>
      </div>
    </>
  );
}
