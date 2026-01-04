import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Flame, CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

export default function Features() {
  return (
    <section id="Features" className="py-16 md:py-28">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
            Everything you need to stay consistent
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Track daily habits, build streaks, and see your progress clearly — without complexity.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {/* 1 */}
          <Card className="group border-border bg-card/60 backdrop-blur-sm shadow-sm transition hover:shadow-md">
            <CardHeader className="pb-3">
              <CardDecorator>
                <CheckCircle2 className="size-6 text-primary" aria-hidden />
              </CardDecorator>

              <div className="mt-6 flex items-center justify-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  One-tap daily check-ins
                </h3>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mark habits complete in seconds. Simple UI that makes “showing up” effortless.
              </p>
            </CardContent>
          </Card>

          {/* 2 */}
          <Card className="group border-border bg-card/60 backdrop-blur-sm shadow-sm transition hover:shadow-md">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Flame className="size-6 text-primary" aria-hidden />
              </CardDecorator>

              <div className="mt-6 flex items-center justify-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  Streaks that motivate
                </h3>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track current and best streaks automatically. Keep momentum and build real consistency.
              </p>
            </CardContent>
          </Card>

          {/* 3 */}
          <Card className="group border-border bg-card/60 backdrop-blur-sm shadow-sm transition hover:shadow-md">
            <CardHeader className="pb-3">
              <CardDecorator>
                <BarChart3 className="size-6 text-primary" aria-hidden />
              </CardDecorator>

              <div className="mt-6 flex items-center justify-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  Analytics & heatmap
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  PRO
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                See completion trends, weekly progress, and a GitHub-style heatmap to spot patterns fast.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Small bottom line (optional but helps conversion) */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          Free includes 3 habits. Pro unlocks unlimited habits + analytics.
        </div>
      </div>
    </section>
  );
}

function CardDecorator({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto grid place-items-center">
      {/* soft glow */}
      <div className="absolute -inset-8 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />

      {/* grid background */}
      <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative z-10 grid h-full w-full place-items-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-card">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}