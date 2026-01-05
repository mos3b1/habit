import { UpgradeButton } from "@/component/upgrade-button";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing({ showbutton }: { showbutton: boolean }) {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Start free. Upgrade when your habits grow.
          </h1>
          <p>
            HabitFlow keeps you consistent with one‑tap check‑ins, streaks, and
            clear analytics. Free for your first 3 habits. Pro unlocks unlimited
            habits and full history when you’re ready.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">Free</h2>
                <span className="my-3 block text-2xl font-semibold">
                  $0 / month
                </span>
                <p className="text-muted-foreground text-sm">Perfect to get started and build your first routines.</p>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Get Started – Free forever</Link>
              </Button>

              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Track up to 3 habits",
                  "One‑tap daily check‑ins",
                  "Basic streak counter",
                  "7‑day history",
                  "Personal dashboard"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">Pro</h2>
                  <span className="my-3 block text-2xl font-semibold">
                    $2 / month
                  </span>
                  <p className="text-muted-foreground text-sm">Per editor</p>
                </div>

                {showbutton && (
                  <UpgradeButton asChild className="w-full">
                    <Link href="">Get Started</Link>
                  </UpgradeButton>
                )}
              </div>

              <div>
                <div className="text-sm font-medium">
                  Everything in Free plus :
                </div>

                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {[
                    "Unlimited habits",
                    "Advanced analytics (weekly & monthly stats)",
                    "Full history & calendar heatmap",
                    "Export data (CSV)",
                    "Priority support"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
