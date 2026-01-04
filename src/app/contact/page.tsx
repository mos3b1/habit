export const metadata = {
  title: "Contact | HabitFlow",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        Need help or want to report a bug?
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <p className="text-muted-foreground">
          Email us at{" "}
          <a className="text-primary hover:underline" href="mailto:support@habitflow.app">
            support@habitflow.app
          </a>
        </p>
      </div>
    </main>
  );
}