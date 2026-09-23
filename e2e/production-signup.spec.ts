import { expect, test } from "@playwright/test";

test("production signup smoke", async ({ page }) => {
  const suffix = (process.env.GITHUB_SHA || Date.now().toString()).slice(0, 12);
  const email = `maduca-e2e-${suffix}@example.com`;
  const password = "MaducaSmoke2026!";

  console.log(`MADUCA_SMOKE_EMAIL=${email}`);

  await page.goto("/login", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Maduca/i);
  await expect(
    page.getByRole("heading", { name: "Entre ou crie sua conta" }),
  ).toBeVisible();

  await page.getByLabel("Nome").fill("Maduca E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Criar conta" }).click();
  await page.waitForLoadState("networkidle");

  const body = await page.locator("body").innerText();
  const currentUrl = page.url();
  const confirmationRequired = body.includes(
    "Conta criada. Confira seu email para confirmar o cadastro",
  );
  const authenticated =
    !currentUrl.includes("/login") &&
    (body.includes("Hoje") || body.includes("Estúdio"));

  console.log(`MADUCA_SMOKE_URL=${currentUrl}`);
  console.log(
    `MADUCA_SMOKE_RESULT=${
      authenticated
        ? "authenticated"
        : confirmationRequired
          ? "confirmation_required"
          : "unexpected"
    }`,
  );

  expect(
    authenticated || confirmationRequired,
    `Cadastro terminou em estado inesperado. URL: ${currentUrl}\n${body}`,
  ).toBeTruthy();
});
