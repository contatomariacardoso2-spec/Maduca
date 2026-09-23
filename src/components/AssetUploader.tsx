"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LivePortfolioItem } from "@/lib/types";

export default function AssetUploader({
  userId,
  workspaceId,
  onUploaded,
}: {
  userId: string;
  workspaceId: string;
  onUploaded: (item: LivePortfolioItem) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(formData: FormData) {
    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim();

    if (!(file instanceof File) || !file.size || !title) {
      setMessage("Escolha um arquivo e dê um título.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setMessage("O arquivo deve ter no máximo 100 MB.");
      return;
    }

    setBusy(true);
    setMessage("");

    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const path = `${userId}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("ugc-assets")
      .upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      setBusy(false);
      setMessage(uploadError.message);
      return;
    }

    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({
        workspace_id: workspaceId,
        title,
        media_url: path,
        is_public: false,
        permission_status: "unknown",
      })
      .select("id,title,category,skill_tag,media_url,is_public,permission_status")
      .single();

    if (error) {
      await supabase.storage.from("ugc-assets").remove([path]);
      setBusy(false);
      setMessage(error.message);
      return;
    }

    onUploaded({
      id: data.id,
      title: data.title,
      category: data.category,
      skillTag: data.skill_tag,
      mediaPath: data.media_url,
      isPublic: Boolean(data.is_public),
      permissionStatus: data.permission_status || "unknown",
    });

    setBusy(false);
    setMessage("Arquivo enviado para o storage privado.");
  }

  return (
    <form action={upload} className="upload-box">
      <div>
        <strong>Adicionar mídia ao portfólio</strong>
        <p>O arquivo fica privado até você registrar permissão e publicá-lo.</p>
      </div>
      <input name="title" placeholder="Título da peça" required />
      <input
        name="file"
        type="file"
        accept="video/mp4,video/quicktime,image/jpeg,image/png,image/webp"
        required
      />
      <button className="primary" disabled={busy}>
        {busy ? "Enviando…" : "Enviar"}
      </button>
      {message && <small className="upload-message">{message}</small>}
    </form>
  );
}
