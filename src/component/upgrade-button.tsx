"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function UpgradeButton({
  asChild,
  className,
  children,
  ...props
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const onUpgrade = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });

      const text = await res.text();

      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.error || text || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      if (!data?.url) {
        throw new Error("No checkout URL returned from server");
      }

      window.location.href = data.url;
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      onClick={onUpgrade}
      disabled={loading}
      className={cn(
        "w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors",
        className
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children || (loading ? "Redirecting..." : "Upgrade to Pro")}
        </>
      )}
    </Comp>
  );
}