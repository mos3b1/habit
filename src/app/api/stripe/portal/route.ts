import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/user";

export async function POST() {
    try {
        const user = await getOrCreateUser();
        if (!user || !user.stripeCustomerId) {
            return NextResponse.json({ error: "Unauthorized or no customer ID" }, { status: 401 });
        }

        const stripe = getStripe();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${appUrl}/dashboard/billing`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Portal error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
