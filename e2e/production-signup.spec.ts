import { expect, test } from "@playwright/test";

test("production auth screen smoke", async ({ page }) => {
  await page.goto("/login", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Maduca/i);
  await expect(
    page.getByRole("heading", { name: "Entre ou crie sua conta" }),
  ).toBeVisible();
  await expect(page.getByLabel("Nome")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Criar conta" })).toBeVisible();
});
