import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { ManageSubscriptionButton } from "@/component/manage-subscription-button";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; reason?: string }>;
}) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { upgraded, reason } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {upgraded === "true" && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-primary">
          🎉 You are now Pro!
        </div>
      )}

      {upgraded === "false" && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          Upgrade verification failed{reason ? ` (${reason})` : ""}. If you paid, contact support.
        </div>
      )}

      <div className="rounded-2xl border bg-card p-8">
        <h1 className="text-2xl font-bold text-primary">Billing</h1>
        <p className="mt-2 text-card-foreground">Your current subscription status.</p>

        <div className="mt-6 rounded-xl border p-6">
          <p className="text-sm text-card-foreground">Current plan</p>
          <p className="mt-1 text-3xl font-bold text-primary">
            {user.plan === "pro" ? "Pro" : "Free"}
          </p>

          <div className="mt-4 text-sm text-card-foreground">
            {user.plan === "pro" ? (
              <>
                <p>✅ Unlimited habits unlocked</p>
                <div className="mt-6 pt-4 border-t">
                  <ManageSubscriptionButton />
                </div>
              </>
            ) : (
              <>
                <p>Free plan limit: 3 habits</p>
                <p className="mt-4">
                  <Link
                    href="/dashboard/upgrade"
                    className="inline-flex rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Upgrade to Pro
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link className="text-primary hover:underline" href="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}