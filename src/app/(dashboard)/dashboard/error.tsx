"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-background p-6">
      <h2 className="text-lg font-semibold text-primary">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}