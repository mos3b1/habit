import { getOrCreateUser } from "@/lib/user";
import { HeroHeaderDashboardClient } from "./hero-header-dashboard.client";

export async function HeroHeaderDashboard() {
  const user = await getOrCreateUser();
  const isPro = user?.plan === "pro";

  return <HeroHeaderDashboardClient isPro={isPro} />;
}