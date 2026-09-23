import { createClient } from "@/lib/supabase/server";
import type { LiveWorkspaceData } from "@/lib/types";

export async function loadWorkspaceData(): Promise<LiveWorkspaceData | null> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) return null;

  const [{ data: profile }, { data: workspace, error: workspaceError }] =
    await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
      supabase
        .from("workspaces")
        .select("id,name,monthly_goal")
        .eq("owner_id", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

  if (workspaceError || !workspace) {
    throw new Error("Workspace not found. Check the Supabase schema/trigger.");
  }

  const workspaceId = workspace.id as string;

  const [tasksRes, brandsRes, productsRes, campaignsRes, portfolioRes] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("id,title,due_at,priority,completed_at")
        .eq("workspace_id", workspaceId)
        .order("completed_at", { ascending: true, nullsFirst: true })
        .order("due_at", { ascending: true, nullsFirst: false }),
      supabase
        .from("brands")
        .select("id,name,category,stage,estimated_value,next_action")
        .eq("workspace_id", workspaceId)
        .order("updated_at", { ascending: false }),
      supabase
        .from("products")
        .select("id,name,category,owned,acquisition_cost,creative_potential,priority")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false }),
      supabase
        .from("campaigns")
        .select("id,title,status,fee,deadline,deliverables,usage_rights,included_revisions,payment_status,brands(name)")
        .eq("workspace_id", workspaceId)
        .order("deadline", { ascending: true, nullsFirst: false }),
      supabase
        .from("portfolio_items")
        .select("id,title,category,skill_tag,media_url,is_public,permission_status")
        .eq("workspace_id", workspaceId)
        .order("sort_order", { ascending: true }),
    ]);

  const firstError =
    tasksRes.error ||
    brandsRes.error ||
    productsRes.error ||
    campaignsRes.error ||
    portfolioRes.error;
  if (firstError) throw firstError;

  return {
    userId,
    displayName: (profile?.display_name as string | null) || "Madu",
    workspaceId,
    workspaceName: workspace.name as string,
    monthlyGoal: Number(workspace.monthly_goal || 0),
    tasks: (tasksRes.data || []).map((row) => ({
      id: row.id,
      title: row.title,
      dueAt: row.due_at,
      priority: row.priority || "normal",
      completed: Boolean(row.completed_at),
    })),
    brands: (brandsRes.data || []).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      stage: row.stage,
      value: Number(row.estimated_value || 0),
      next: row.next_action,
    })),
    products: (productsRes.data || []).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      owned: Boolean(row.owned),
      cost: Number(row.acquisition_cost || 0),
      ideas: Number(row.creative_potential || 0),
      priority: row.priority || "medium",
    })),
    campaigns: (campaignsRes.data || []).map((row) => ({
      id: row.id,
      brand: Array.isArray(row.brands)
        ? row.brands[0]?.name || "Sem marca"
        : (row.brands as { name?: string } | null)?.name || "Sem marca",
      title: row.title,
      deadline: row.deadline,
      status: row.status,
      fee: Number(row.fee || 0),
      deliverables: row.deliverables,
      usageRights: row.usage_rights,
      revisions: Number(row.included_revisions || 0),
      paymentStatus: row.payment_status || "pending",
    })),
    portfolio: (portfolioRes.data || []).map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      skillTag: row.skill_tag,
      mediaPath: row.media_url,
      isPublic: Boolean(row.is_public),
      permissionStatus: row.permission_status || "unknown",
    })),
  };
}
