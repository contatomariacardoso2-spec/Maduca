"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safeMessage(message: string) {
  return encodeURIComponent(message.slice(0, 180));
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || password.length < 6) {
    redirect("/login?error=" + safeMessage("Informe um email válido e uma senha com pelo menos 6 caracteres."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + safeMessage(error.message));
  }

  redirect("/");
}

export async function signup(formData: FormData) {
  const displayName = String(formData.get("displayName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || password.length < 6) {
    redirect("/login?error=" + safeMessage("Informe um email válido e uma senha com pelo menos 6 caracteres."));
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || "Creator" },
      emailRedirectTo: siteUrl + "/login?confirmed=1",
    },
  });

  if (error) {
    redirect("/login?error=" + safeMessage(error.message));
  }

  if (data.session) {
    redirect("/");
  }

  redirect("/login?message=" + safeMessage("Conta criada. Confira seu email para confirmar o cadastro e depois faça login."));
}
