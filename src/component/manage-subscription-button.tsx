"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings2 } from "lucide-react";

export function ManageSubscriptionButton() {
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to open portal");

            window.location.href = data.url;
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={onClick}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
        >
            <Settings2 className="size-4" />
            {loading ? "Opening..." : "Manage Subscription"}
        </Button>
    );
}
