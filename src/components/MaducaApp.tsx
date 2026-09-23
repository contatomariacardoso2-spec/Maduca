"use client";

import { useEffect, useMemo, useState } from "react";
import { brands, campaigns, products, tasks as seedTasks } from "@/lib/demo-data";
import type { NavKey, Task } from "@/lib/types";

const menu: Array<{key:NavKey;label:string;icon:string}> = [
  {key:"hoje",label:"Hoje",icon:"⌂"},
  {key:"studio",label:"Estúdio",icon:"✦"},
  {key:"ideias",label:"Ideias & produtos",icon:"◫"},
  {key:"trabalhos",label:"Trabalhos",icon:"▣"},
  {key:"marcas",label:"Marcas & propostas",icon:"◎"},
  {key:"portfolio",label:"Portfólio",icon:"◇"},
  {key:"financeiro",label:"Dinheiro",icon:"$"},
  {key:"calendario",label:"Calendário",icon:"□"},
  {key:"review",label:"Review semanal",icon:"↻"},
];

const brl=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);

function Card({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <section className={`card ${className}`}>{children}</section>;
}
function Header({eyebrow,title,description,action}:{eyebrow:string;title:string;description?:string;action?:React.ReactNode}) {
  return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div>;
}
function Pill({children,tone="neutral"}:{children:React.ReactNode;tone?:string}) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export default function MaducaApp(){
  const [active,setActive]=useState<NavKey>("hoje");
  const [tasks,setTasks]=useState<Task[]>(seedTasks);
  const [brief,setBrief]=useState("Vídeo UGC de 30 segundos para um sérum facial. Mostrar textura, aplicação e resultado percebido. Tom natural e próximo.");
  const [generated,setGenerated]=useState(false);

  useEffect(()=>{
    const saved=localStorage.getItem("maduca.tasks");
    if(saved){try{setTasks(JSON.parse(saved))}catch{}}
  },[]);
  useEffect(()=>{localStorage.setItem("maduca.tasks",JSON.stringify(tasks))},[tasks]);

  const toggle=(id:string)=>setTasks(curr=>curr.map(t=>t.id===id?{...t,done:!t.done}:t));
  const revenue=campaigns.reduce((a,c)=>a+c.fee,0);
  const pending=campaigns.filter(c=>c.payment!=="Pago").reduce((a,c)=>a+c.fee,0);
  const complete=tasks.filter(t=>t.done).length;

  const screen=useMemo(()=>{
    const props={setActive,tasks,toggle,revenue,pending,complete,brief,setBrief,generated,setGenerated};
    switch(active){
      case "hoje": return <Today {...props}/>;
      case "studio": return <Studio {...props}/>;
      case "ideias": return <Ideas/>;
      case "trabalhos": return <Jobs/>;
      case "marcas": return <CRM/>;
      case "portfolio": return <Portfolio/>;
      case "financeiro": return <Money/>;
      case "calendario": return <Calendar/>;
      default: return <Review/>;
    }
  },[active,tasks,revenue,pending,complete,brief,generated]);

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">M</span><div><strong>Maduca</strong><small>UGC operating system</small></div></div>
      <div className="profile"><span>ME</span><div><strong>Maria Eduarda</strong><small>Creator workspace</small></div></div>
      <nav><small className="nav-title">WORKSPACE</small>{menu.map(item=><button key={item.key} className={active===item.key?"nav active":"nav"} onClick={()=>setActive(item.key)}><i>{item.icon}</i>{item.label}{item.key==="hoje"&&<b>3</b>}</button>)}</nav>
      <div className="goal"><div><span>Meta do mês</span><strong>R$ 3.200 / R$ 5.000</strong></div><div className="progress"><i style={{width:"64%"}}/></div></div>
    </aside>
    <section className="workspace">
      <header className="topbar"><div className="search">⌕ <span>Buscar ideias, marcas, campanhas…</span><kbd>⌘ K</kbd></div><div><button className="icon">?</button><button className="primary" onClick={()=>setActive("studio")}>＋ Novo</button></div></header>
      <div className="content">{screen}</div>
    </section>
  </main>;
}

function Today({setActive,tasks,toggle,revenue,pending,complete}:any){
  return <>
    <div className="hero"><div><span className="eyebrow">QUARTA-FEIRA • 23 DE SETEMBRO</span><h1>Boa tarde, Madu <em>✦</em></h1><p>Você tem <strong>3 próximos passos</strong> entre você e uma semana mais organizada.</p></div><div className="ring"><strong>{Math.round(complete/tasks.length*100)}%</strong><span>do dia</span></div></div>
    <div className="metrics">
      <Metric label="Receita em campanhas" value={brl(revenue)} foot="↗ 18% vs. mês passado"/>
      <Metric label="A receber" value={brl(pending)} foot="3 pagamentos em aberto"/>
      <Metric label="Campanhas ativas" value="3" foot="1 entrega em 24h"/>
      <Metric label="Propostas em jogo" value="4" foot="2 precisam de follow-up"/>
    </div>
    <div className="grid2">
      <Card><h2>Hoje</h2><p className="muted">PRÓXIMOS PASSOS</p><div className="tasks">{tasks.map((t:Task)=><label key={t.id} className={t.done?"task done":"task"}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span className={`dot ${t.tone}`}/><div><strong>{t.title}</strong><small>{t.meta}</small></div></label>)}</div><button className="link">＋ Adicionar tarefa</button></Card>
      <Card><h2>Linha de criação</h2><p className="muted">PRODUÇÃO</p><div className="pipeline">{[["Briefings",3],["Roteiros",2],["Gravar",4],["Editar",2],["Aprovação",1]].map(([n,v])=><button key={String(n)} onClick={()=>setActive("studio")}><span>{n}</span><strong>{v}</strong></button>)}</div><div className="deadline"><span className="date"><strong>24</strong><small>SET</small></span><div><small>PRÓXIMA ENTREGA</small><strong>Lumière • Sérum Vitamina C</strong><span>2 vídeos + 4 hooks • edição</span></div><button onClick={()=>setActive("trabalhos")}>Abrir →</button></div></Card>
    </div>
    <div className="grid2">
      <Card><h2>Marcas que pedem atenção</h2>{brands.slice(2).map(b=><div className="brand-row" key={b.name}><span className="avatar">{b.name[0]}</span><div><strong>{b.name}</strong><small>{b.category}</small></div><Pill tone={b.stage==="Follow-up"?"warm":"neutral"}>{b.stage}</Pill><small>{b.next}</small></div>)}</Card>
      <Card className="insight"><span className="spark">✦</span><p className="muted">MADUCA INSIGHT</p><h2>Você já tem material para criar antes de comprar mais produtos.</h2><p>Seu inventário atual rende cerca de <strong>23 conceitos de vídeo</strong>. Grave primeiro; compre depois com uma lacuna de portfólio em mente.</p><button onClick={()=>setActive("ideias")}>Ver oportunidades →</button></Card>
    </div>
  </>;
}
function Metric({label,value,foot}:{label:string;value:string;foot:string}){return <Card><small>{label}</small><div className="metric">{value}</div><span className="metric-foot">{foot}</span></Card>}

function Studio({brief,setBrief,generated,setGenerated}:any){
  return <>
    <Header eyebrow="ESTÚDIO DE CRIAÇÃO" title="Do briefing à gravação, sem caos." description="Cole o pedido da marca e transforme tudo em um plano de filmagem executável." action={<button className="secondary">Salvar rascunho</button>}/>
    <div className="studio">
      <Card><label className="field">BRIEFING DA MARCA<textarea value={brief} onChange={e=>setBrief(e.target.value)}/></label><div className="form4">{["Formato","Duração","Objetivo","Tom"].map((x,i)=><label key={x}>{x}<select defaultValue={i===0?"UGC vertical 9:16":i===1?"30 segundos":i===2?"Conversão":"Natural & próximo"}><option>{i===0?"UGC vertical 9:16":i===1?"30 segundos":i===2?"Conversão":"Natural & próximo"}</option></select></label>)}</div><button className="ai" onClick={()=>setGenerated(true)}>✦ Transformar briefing em plano</button></Card>
      <Card className="copilot"><p className="muted">MADUCA COPILOT</p>{!generated?<div className="empty"><span>✦</span><h3>Seu plano aparece aqui.</h3><p>O briefing permanece intacto. A IA cria uma versão derivada e editável.</p></div>:<div className="plan"><section><small>CONCEITO</small><h3>“Minha pele quando eu finalmente simplifico a rotina.”</h3></section><section><small>HOOKS</small><ol><li>“Eu parei de usar cinco produtos de manhã.”</li><li>“Se sua rotina demora demais, olha isso.”</li><li>“A textura desse sérum me ganhou primeiro.”</li></ol></section><section><small>SHOT LIST</small>{["Close do produto na mão","Textura no dorso da mão","Aplicação no rosto","B-roll na bancada","CTA olhando para câmera"].map((x,i)=><div className="shot" key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span><small>{i<2?"close":"médio"}</small></div>)}</section><div className="warning">⚠ Claims objetivos do produto devem ser conferidos no briefing oficial da marca.</div></div>}</Card>
    </div>
  </>;
}

function Ideas(){
  return <>
    <Header eyebrow="BANCO CRIATIVO" title="Ideias & produtos" description="Veja o que você já tem, quantos conteúdos isso pode render e onde seu portfólio ainda tem lacunas." action={<button className="primary">＋ Produto</button>}/>
    <div className="metrics"><Metric label="Produtos cadastrados" value="18" foot="12 já estão em casa"/><Metric label="Ideias abertas" value="37" foot="23 prontas para gravar"/><Metric label="Lacunas do portfólio" value="3" foot="Casa • Pet • Tech"/><Metric label="Custo planejado" value="R$ 169" foot="1 compra em avaliação"/></div>
    <Card><div className="table-head"><h2>Inventário criativo</h2><button className="secondary">Analisar compra</button></div><div className="data-table"><div className="tr th"><span>Produto</span><span>Categoria</span><span>Status</span><span>Ideias</span><span>Prioridade</span></div>{products.map(p=><div className="tr" key={p.name}><span><strong>{p.name}</strong></span><span>{p.category}</span><span>{p.owned?"Já tenho":brl(p.cost)}</span><span>{p.ideas} vídeos</span><span><Pill tone={p.priority==="Alta"?"good":p.priority==="Baixa"?"warm":"neutral"}>{p.priority}</Pill></span></div>)}</div></Card>
    <div className="grid3">{[["Beauty","Antes/depois percebido, rotina, textura","8 peças"],["Tech","Tutorial, POV, unboxing, problema→solução","4 peças"],["Casa","Organização, transformação, rotina","2 peças"]].map(x=><Card key={x[0]}><Pill>{x[0]}</Pill><h3>{x[1]}</h3><p>{x[2]} no portfólio</p><button className="link">Gerar ideias →</button></Card>)}</div>
  </>;
}

function Jobs(){
  return <>
    <Header eyebrow="TRABALHOS" title="Campanhas sem informação perdida." description="Escopo, uso, revisões, arquivos brutos, prazo e dinheiro no mesmo lugar." action={<button className="primary">＋ Nova campanha</button>}/>
    <div className="campaigns">{campaigns.map(c=><Card key={c.id}><div className="campaign-top"><div><Pill tone="good">{c.status}</Pill><h3>{c.brand}</h3><p>{c.title}</p></div><strong>{brl(c.fee)}</strong></div><div className="campaign-meta"><span><small>Entrega</small><strong>{c.deadline}</strong></span><span><small>Pagamento</small><strong>{c.payment}</strong></span></div><div className="details"><p><span>Entregáveis</span>{c.deliverables}</p><p><span>Uso</span>{c.usage}</p><p><span>Revisões</span>{c.revisions} incluída(s)</p></div><button className="secondary full">Abrir campanha</button></Card>)}</div>
    <Card><h2>Antes de dizer “sim”</h2><div className="check-grid">{[["Escopo","Vídeos, fotos, hooks e versões"],["Uso","Orgânico, Ads, prazo e território"],["Exclusividade","Categoria e duração"],["Raw files","Incluídos ou cobrados à parte"],["Revisões","Limite e definição de refação"],["Pagamento","Valor, vencimento e condições"]].map(([a,b])=><div key={a}><span>✓</span><div><strong>{a}</strong><p>{b}</p></div></div>)}</div></Card>
  </>;
}

function CRM(){
  const stages=["Quero contatar","Proposta","Follow-up","Fechado"];
  return <>
    <Header eyebrow="CRM" title="Marcas & propostas" description="Quem respondeu, quem sumiu e quem precisa de follow-up — sem depender da memória." action={<button className="primary">＋ Nova marca</button>}/>
    <div className="kanban">{stages.map(stage=><div className="kanban-col" key={stage}><div className="kanban-title"><strong>{stage}</strong><span>{brands.filter(b=>b.stage===stage).length}</span></div>{brands.filter(b=>b.stage===stage).map(b=><Card key={b.name}><div className="brand-row compact"><span className="avatar">{b.name[0]}</span><div><strong>{b.name}</strong><small>{b.category}</small></div></div>{b.value>0&&<div className="proposal">{brl(b.value)}</div>}<small>{b.next}</small></Card>)}</div>)}</div>
    <Card><h2>Cadência de prospecção</h2><div className="cadence">{[["D0","Pitch personalizado"],["D4","Follow-up curto"],["D10","Último toque"],["D30","Retomar com novidade"]].map(x=><div key={x[0]}><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div></Card>
  </>;
}

function Portfolio(){
  const items=[["Sérum — testimonial","Beauty","Conversão","Público"],["Action 4 — tutorial","Tech","Educação","Público"],["Rotina de treino","Fitness","Lifestyle","Público"],["Organização da cozinha","Casa","Problema → solução","Privado"],["Rotina com Moana","Pet","Storytelling","Público"],["Perfume — review","Beauty","Review","Público"]];
  return <>
    <Header eyebrow="PORTFÓLIO" title="Seu melhor trabalho, pronto para vender." description="Organize por habilidade e só exponha o que estiver liberado." action={<button className="primary">＋ Adicionar vídeo</button>}/>
    <div className="portfolio-banner"><div><small>LINK PÚBLICO</small><strong>maduca.me/portfolio</strong><span>6 peças • 5 públicas</span></div><button>Copiar link</button><button>Visualizar ↗</button></div>
    <div className="portfolio">{items.map((it,i)=><Card key={it[0]}><div className={`thumb t${i%4}`}><span>▶</span><small>00:{18+i*3}</small></div><div className="portfolio-info"><div><h3>{it[0]}</h3><p>{it[1]} • {it[2]}</p></div><Pill tone={it[3]==="Público"?"good":"warm"}>{it[3]}</Pill></div></Card>)}</div>
  </>;
}

function Money(){
  return <>
    <Header eyebrow="FINANCEIRO" title="Dinheiro sem “achismo”." description="Separe fee, permuta, custos e horas para saber quanto o trabalho realmente valeu." action={<button className="primary">＋ Lançamento</button>}/>
    <div className="metrics"><Metric label="Faturamento do mês" value="R$ 2.050" foot="meta: R$ 5.000"/><Metric label="A receber" value="R$ 1.775" foot="86% ainda aberto"/><Metric label="Custos UGC" value="R$ 297" foot="equipamento + props"/><Metric label="Hora efetiva média" value="R$ 92" foot="baseado em 22,3h"/></div>
    <div className="grid2"><Card><h2>Receita por categoria</h2>{[["Beauty",950,46],["Fitness",650,32],["Casa",300,15],["Pet",150,7]].map(([n,v,p]:any)=><div className="bar-row" key={n}><div><span>{n}</span><strong>{brl(v)}</strong></div><i><b style={{width:`${p}%`}}/></i></div>)}</Card><Card><h2>Rentabilidade</h2>{[["Lumière","5h20","R$ 122/h"],["Movi","9h10","R$ 98/h"],["Casa Nuvem","7h45","R$ 65/h"]].map(r=><div className="profit" key={r[0]}><strong>{r[0]}</strong><span>{r[1]}</span><b>{r[2]}</b></div>)}</Card></div>
  </>;
}

function Calendar(){
  const days=["SEG 21","TER 22","QUA 23","QUI 24","SEX 25","SÁB 26","DOM 27"];
  return <>
    <Header eyebrow="CALENDÁRIO" title="Sua semana criativa" description="Organize o UGC em torno da sua vida — e não o contrário." action={<button className="primary">＋ Bloco</button>}/>
    <Card className="calendar"><div className="week">{days.map((d,i)=><div key={d} className={i===2?"today":""}><strong>{d}</strong>{i===0&&<><Event type="edit" time="09:00" title="Roteiros + edição"/><Event type="course" time="14:00" title="Curso UGC"/></>}{i===2&&<><Event type="record" time="09:00" title="Gravação"/><Event type="record" time="14:00" title="B-roll produtos"/></>}{i===3&&<Event type="deadline" time="18:00" title="Entrega Lumière"/>}{i===4&&<Event type="study" time="08:30" title="Traumatologia"/>}{i===6&&<Event type="review" time="18:00" title="Review semanal"/>}</div>)}</div></Card>
    <div className="note"><strong>Regra do Maduca:</strong> segunda organiza e edita; quarta grava. O app protege seus blocos criativos antes de sugerir novas tarefas.</div>
  </>;
}
function Event({type,time,title}:{type:string;time:string;title:string}){return <div className={`event ${type}`}><small>{time}</small><strong>{title}</strong></div>}

function Review(){
  return <>
    <Header eyebrow="REVIEW SEMANAL" title="30 minutos para ficar melhor toda semana." description="Produção, comercial e aprendizado em uma revisão curta." action={<button className="primary">Concluir semana ✓</button>}/>
    <div className="review-grid">
      <Card><b className="step">01</b><h3>O que saiu do papel?</h3><label><input type="checkbox" defaultChecked/> 4 vídeos gravados</label><label><input type="checkbox" defaultChecked/> 2 propostas enviadas</label><label><input type="checkbox"/> Portfólio atualizado</label></Card>
      <Card><b className="step">02</b><h3>O que funcionou?</h3><textarea defaultValue="Hooks com fala direta ficaram mais naturais. Gravar os B-rolls em lote poupou tempo."/></Card>
      <Card><b className="step">03</b><h3>O que travou?</h3><textarea defaultValue="Demorei para começar a edição porque não tinha nomeado os arquivos."/></Card>
      <Card><b className="step">04</b><h3>O que testar agora?</h3><textarea defaultValue={"1. Abrir com problema.\n2. CTA mais conversacional.\n3. Prospectar 5 marcas de casa."}/></Card>
    </div>
    <Card className="score"><div><p className="muted">PLACAR DA SEMANA</p><h2>Você produziu mais do que prospectou.</h2><p>Na próxima semana, mantenha os blocos de produção e adicione uma sessão curta de outreach.</p></div><div>{[["Produção",82],["Comercial",48],["Portfólio",64]].map(([n,v]:any)=><div className="score-row" key={n}><span>{n}</span><i><b style={{width:`${v}%`}}/></i><strong>{v}</strong></div>)}</div></Card>
  </>;
}
