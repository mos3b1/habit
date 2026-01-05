import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/user";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Basic checks
  if (session.mode !== "subscription") {
    return NextResponse.json({ error: "Not a subscription session" }, { status: 400 });
  }

  // In test mode, payment_status typically becomes "paid"
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const subscriptionId = session.subscription as string | null;
  const customerId = session.customer as string | null;

  if (!subscriptionId || !customerId) {
    return NextResponse.json({ error: "Missing subscription/customer on session" }, { status: 400 });
  }

  // ✅ Update DB
  await db
    .update(users)
    .set({
      plan: "pro",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return NextResponse.json({ ok: true });
}