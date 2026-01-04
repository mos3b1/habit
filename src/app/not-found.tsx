import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="mt-3 text-muted-foreground">That page doesn’t exist.</p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}