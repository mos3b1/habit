import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        const dbUserId = session.metadata?.dbUserId;

        if (!dbUserId) {
            console.error("checkout.session.completed: Missing dbUserId in session metadata", {
                sessionId: session.id,
                customerId: session.customer,
            });
            return NextResponse.json({ error: "Missing dbUserId in metadata" }, { status: 400 });
        }

        await db
            .update(users)
            .set({
                plan: "pro",
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                updatedAt: new Date(),
            })
            .where(eq(users.id, dbUserId));
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;

        await db
            .update(users)
            .set({
                plan: "free",
                updatedAt: new Date(),
            })
            .where(eq(users.stripeSubscriptionId, subscription.id));
    }

    return NextResponse.json({ received: true });

}
