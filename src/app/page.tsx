import { redirect } from "next/navigation";
import MaducaLiveApp from "@/components/MaducaLiveApp";
import { loadWorkspaceData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await loadWorkspaceData();

  if (!data) {
    redirect("/login");
  }

  return <MaducaLiveApp initial={data} />;
}
