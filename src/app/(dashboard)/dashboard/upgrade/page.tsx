import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import Link from "next/link";
import { UpgradeButton } from "@/component/upgrade-button";

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
    <div className="mx-auto max-w-2xl space-y-6">
      {canceled === "true" && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          Payment canceled. You can try again anytime.
        </div>
      )}

      <div className="rounded-2xl border bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-900">Upgrade to Pro</h1>
        <p className="mt-2 text-slate-600">
          Unlock unlimited habits and premium analytics.
        </p>

        <div className="mt-6 rounded-xl border p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Habit Tracker Pro</p>
              <p className="mt-1 text-4xl font-bold text-slate-900">$5</p>
              <p className="text-slate-500">per month</p>
            </div>
            <div className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
              Most Popular
            </div>
          </div>

          <ul className="mt-6 space-y-2 text-slate-700">
            <li>✅ Unlimited habits</li>
            <li>✅ Advanced analytics</li>
            <li>✅ Full history & heatmap</li>
          </ul>

          <div className="mt-6">
            <UpgradeButton />
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Cancel anytime.
          </p>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          <p>
            Current plan: <span className="font-semibold">Free</span> (3 habits max)
          </p>
          <Link className="text-teal-700 hover:underline" href="/dashboard/billing">
            Go to Billing →
          </Link>
        </div>
      </div>
    </div>
  );
}