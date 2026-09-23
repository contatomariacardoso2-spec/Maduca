import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; confirmed?: string }>;
}) {
  const params = await searchParams;
  const notice =
    params.confirmed === "1"
      ? "Email confirmado. Agora você já pode entrar."
      : params.message;

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <span className="brand-mark">M</span>
        <p className="eyebrow">MADUCA • UGC OS</p>
        <h1>Seu trabalho de creator, em um só lugar.</h1>
        <p>
          Ideias, briefings, campanhas, propostas, direitos de uso, arquivos,
          portfólio e dinheiro — sem depender da memória.
        </p>
      </section>

      <section className="auth-card">
        <div>
          <p className="eyebrow">BEM-VINDA</p>
          <h2>Entre ou crie sua conta</h2>
          <p>Seu workspace é privado e isolado por Row Level Security.</p>
        </div>

        {params.error && <div className="auth-error">{params.error}</div>}
        {notice && <div className="auth-notice">{notice}</div>}

        <form>
          <label>
            Nome
            <input name="displayName" type="text" placeholder="Como você quer aparecer" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" placeholder="voce@email.com" />
          </label>
          <label>
            Senha
            <input name="password" type="password" minLength={6} required autoComplete="current-password" placeholder="Mínimo 6 caracteres" />
          </label>
          <div className="auth-actions">
            <button className="primary" formAction={login}>Entrar</button>
            <button className="secondary" formAction={signup}>Criar conta</button>
          </div>
        </form>
      </section>
    </main>
  );
}
