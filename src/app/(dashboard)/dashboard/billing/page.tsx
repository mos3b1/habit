import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";

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
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-teal-800">
          🎉 You are now Pro!
        </div>
      )}

      {upgraded === "false" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          Upgrade verification failed{reason ? ` (${reason})` : ""}. If you paid, contact support.
        </div>
      )}

      <div className="rounded-2xl border bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
        <p className="mt-2 text-slate-600">Your current subscription status.</p>

        <div className="mt-6 rounded-xl border p-6">
          <p className="text-sm text-slate-600">Current plan</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {user.plan === "pro" ? "Pro" : "Free"}
          </p>

          <div className="mt-4 text-sm text-slate-600">
            {user.plan === "pro" ? (
              <>
                <p>✅ Unlimited habits unlocked</p>
                <p className="mt-2 text-slate-500">
                  (Later we can add a “Manage subscription” portal.)
                </p>
              </>
            ) : (
              <>
                <p>Free plan limit: 3 habits</p>
                <p className="mt-4">
                  <Link
                    href="/dashboard/upgrade"
                    className="inline-flex rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
                  >
                    Upgrade to Pro
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link className="text-teal-700 hover:underline" href="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}