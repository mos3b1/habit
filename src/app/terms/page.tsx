export const metadata = {
  title: "Terms of Service | HabitFlow",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">
        These terms govern your use of HabitFlow.
      </p>

      <section className="mt-10 space-y-4 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">1. Accounts:</span>{" "}
          You are responsible for your account and maintaining the confidentiality of your login.
        </p>
        <p>
          <span className="font-medium text-foreground">2. Subscription:</span>{" "}
          If you upgrade to Pro, billing is handled by Stripe. You can cancel anytime.
        </p>
        <p>
          <span className="font-medium text-foreground">3. Acceptable use:</span>{" "}
          Don’t abuse the service or attempt to access other users’ data.
        </p>
        <p>
          <span className="font-medium text-foreground">4. Disclaimer:</span>{" "}
          HabitFlow is provided “as is” without warranties.
        </p>
        <p>
          <span className="font-medium text-foreground">5. Contact:</span>{" "}
          For questions, email{" "}
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