import { redirect } from "next/navigation";
import MaducaApp from "@/components/MaducaApp";
import MaducaLiveApp from "@/components/MaducaLiveApp";
import { loadWorkspaceData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!configured) {
    return <MaducaApp />;
  }

  const data = await loadWorkspaceData();

  if (!data) {
    redirect("/login");
  }

  return <MaducaLiveApp initial={data} />;
}
