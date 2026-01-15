import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import Link from "next/link";
import { UpgradeButton } from "@/component/upgrade-button";
import { ArrowBigLeftIcon, ArrowRightIcon } from "lucide-react";
import Pricing from "@/components/pricing";

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { canceled } = await searchParams;

  // If already Pro, no need to upgrade
  if (user.plan === "pro") {
    redirect("/dashboard/billing");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-10">
      {canceled === "true" && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 animate-slide-in">
          Payment canceled. You can try again anytime.
        </div>
      )}

      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-heading">Upgrade your potential</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Choose the plan that fits your growth. Move from basic tracking to full optimization.
        </p>
      </div>

      <Pricing showbutton={true} />

      <div className="rounded-2xl border bg-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Current plan</p>
          <p className="text-xl font-bold text-primary capitalize">{user.plan}</p>
        </div>
        <Link
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          href="/dashboard/billing"
        >
          View Billing History <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="flex justify-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowBigLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}