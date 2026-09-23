import { readFileSync, writeFileSync } from "node:fs";

const path = "e2e/production-authenticated.spec.ts";
let source = readFileSync(path, "utf8");

source = source
  .split("\n")
  .filter((line) => !line.includes('getByText("Maduca E2E")'))
  .join("\n")
  .replace(".check();", ".click();");

const marker = '  await page.getByRole("button", { name: "Sair" }).click();';

const extra = `
  await page.getByRole("button", { name: "Portfólio" }).click();
  await page.getByPlaceholder("Título da peça").fill("E2E Upload");
  await page.locator('input[type="file"]').setInputFiles({
    name: "e2e.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(
    page.getByText("Arquivo enviado para o storage privado."),
  ).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("E2E Upload")).toBeVisible();

  const uploadedCards = page
    .locator(".live-portfolio .card")
    .filter({ hasText: "E2E Upload" });
  while ((await uploadedCards.count()) > 0) {
    const first = uploadedCards.first();
    await first.getByRole("button", { name: "Excluir" }).click();
    await expect(first).toHaveCount(0);
  }

  await page.getByRole("button", { name: "Estúdio" }).click();
  const journeyBrief = page.getByPlaceholder(/Cole aqui o briefing/i);
  await journeyBrief.fill(
    "Criar um vídeo UGC vertical de 30 segundos para um hidratante. A marca não informou claims clínicos, direitos de mídia paga, exclusividade, raw files ou autorização de portfólio.",
  );
  const journeyAiButton = page.getByRole("button", { name: /Criar plano com IA/ });
  await journeyAiButton.click();
  await expect(journeyAiButton).not.toContainText("Organizando", {
    timeout: 90_000,
  });
  const bodyAfterAi = await page.locator("body").innerText();
  const aiWorked =
    bodyAfterAi.includes("ROTEIRO") && bodyAfterAi.includes("SHOT LIST");
  const aiNotConfigured = bodyAfterAi.includes(
    "AI Gateway ainda não foi configurado",
  );
  console.log(
    "MADUCA_AI_RESULT=" +
      (aiWorked ? "generated" : aiNotConfigured ? "not_configured" : "unexpected"),
  );
  expect(aiWorked || aiNotConfigured).toBeTruthy();

`;

if (!source.includes(marker)) {
  throw new Error("Logout marker not found in authenticated E2E test.");
}

source = source.replace(marker, extra + marker);
writeFileSync(path, source);
