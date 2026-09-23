import type { Metadata } from "next";
import "./globals.css";
import "./live.css";

export const metadata: Metadata = {
  title: "Maduca — UGC OS",
  description: "Organize ideias, campanhas, marcas, portfólio e finanças do seu trabalho UGC.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
