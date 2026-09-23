import { expect, test, type Page } from "@playwright/test";

const EMAIL = "maduca.e2e.63d122c7847e@gmail.com";
const PASSWORD = "MaducaSmoke2026!";

async function answerPrompts(
  page: Page,
  answers: string[],
  action: () => Promise<void>,
) {
  const queue = [...answers];
  const handler = async (dialog: Parameters<Parameters<Page["on"]>[1]>[0]) => {
    await dialog.accept(queue.shift() || "");
  };

  page.on("dialog", handler);
  try {
    await action();
    await expect.poll(() => queue.length, { timeout: 5_000 }).toBe(0);
  } finally {
    page.removeListener("dialog", handler);
  }
}

test("authenticated production CRUD smoke", async ({ page }) => {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();

  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
  await expect(page.getByText("Dados sincronizados com Supabase")).toBeVisible();
  await expect(page.getByText("Maduca E2E")).toBeVisible();

  await answerPrompts(page, ["E2E tarefa"], async () => {
    await page.getByRole("button", { name: "＋ Tarefa" }).click();
  });
  const task = page.locator(".task").filter({ hasText: "E2E tarefa" });
  await expect(task).toBeVisible();
  await task.locator('input[type="checkbox"]').check();
  await expect(task.locator('input[type="checkbox"]')).toBeChecked();
  await task.getByRole("button", { name: "Excluir" }).click();
  await expect(task).toHaveCount(0);

  await page.getByRole("button", { name: "Ideias & produtos" }).click();
  await answerPrompts(page, ["E2E Produto", "Tech"], async () => {
    await page.getByRole("button", { name: "＋ Produto" }).click();
  });
  const product = page.locator(".tr").filter({ hasText: "E2E Produto" });
  await expect(product).toBeVisible();
  await expect(product).toContainText("Tech");
  await product.getByRole("button", { name: "Alternar" }).click();
  await expect(product).toContainText("Quero comprar");
  await product.getByRole("button", { name: "Excluir" }).click();
  await expect(product).toHaveCount(0);

  await page.getByRole("button", { name: "Marcas & propostas" }).click();
  await answerPrompts(page, ["E2E Marca", "Beauty"], async () => {
    await page.getByRole("button", { name: "＋ Marca" }).click();
  });
  const brand = page.locator(".card").filter({ hasText: "E2E Marca" });
  await expect(brand).toBeVisible();
  await expect(brand).toContainText("Beauty");
  await brand.getByRole("button", { name: "Avançar →" }).click();
  await brand.getByRole("button", { name: "Excluir" }).click();
  await expect(page.getByText("E2E Marca")).toHaveCount(0);

  await page.getByRole("button", { name: "Trabalhos" }).click();
  await answerPrompts(page, ["E2E Campanha", "123"], async () => {
    await page.getByRole("button", { name: "＋ Campanha" }).click();
  });
  const campaign = page.locator(".card").filter({ hasText: "E2E Campanha" });
  await expect(campaign).toBeVisible();
  await expect(campaign).toContainText("R$");
  await campaign.getByRole("button", { name: "Avançar status" }).click();
  await expect(campaign).toContainText("Roteiro");
  await campaign.getByRole("button", { name: "Excluir" }).click();
  await expect(page.getByText("E2E Campanha")).toHaveCount(0);

  await page.getByRole("button", { name: "Sair" }).click();
  await page.waitForURL((url) => url.pathname === "/login", { timeout: 10_000 });
});

test("Studio guards unauthenticated facts and has a callable endpoint", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });

  await page.getByRole("button", { name: "Estúdio" }).click();
  await expect(page.getByRole("heading", { name: "Briefing → plano de gravação." })).toBeVisible();

  const textarea = page.getByPlaceholder(/Cole aqui o briefing/i);
  await textarea.fill(
    "Criar um vídeo UGC de 30 segundos para um hidratante. A marca não informou claims clínicos, direitos de mídia paga, exclusividade ou autorização de portfólio.",
  );
  await expect(page.getByRole("button", { name: /Criar plano com IA/ })).toBeEnabled();
});
