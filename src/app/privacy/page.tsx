export const metadata = {
  title: "Privacy Policy | HabitFlow",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        This explains what we collect and how we use it.
      </p>

      <section className="mt-10 space-y-4 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Data we store:</span>{" "}
          email, profile info (from Clerk), habits you create, and habit logs.
        </p>
        <p>
          <span className="font-medium text-foreground">Payments:</span>{" "}
          Payments are processed by Stripe. We do not store card numbers.
        </p>
        <p>
          <span className="font-medium text-foreground">Analytics:</span>{" "}
          We use your habit logs to calculate streaks and progress insights.
        </p>
        <p>
          <span className="font-medium text-foreground">Contact:</span>{" "}
          Questions? Email{" "}
          <a className="text-primary hover:underline" href="mailto:support@habitflow.app">
            support@habitflow.app
          </a>
          .
        </p>
        <p className="pt-4 text-xs">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </section>
    </main>
  );
}