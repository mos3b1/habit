import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { session_id } = await searchParams;
  if (!session_id) redirect("/dashboard/billing?upgraded=false");

  // Retrieve session + expand subscription
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["subscription"],
  });

  // Security: session must belong to THIS user (we stored dbUserId in metadata)
  const sessionDbUserId = session.metadata?.dbUserId;
  if (!sessionDbUserId || sessionDbUserId !== user.id) {
    redirect("/dashboard/billing?upgraded=false&reason=not_owner");
  }

  // Must be paid
  if (session.payment_status !== "paid") {
    redirect("/dashboard/billing?upgraded=false&reason=not_paid");
  }

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!customerId || !subscriptionId) {
    redirect("/dashboard/billing?upgraded=false&reason=missing_ids");
  }

  // Update DB
  await db
    .update(users)
    .set({
      plan: "pro",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  redirect("/dashboard/billing?upgraded=true");
}