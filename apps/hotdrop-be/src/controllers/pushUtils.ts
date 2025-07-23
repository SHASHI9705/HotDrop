import webpush from "web-push";
import { prismaClient } from "@repo/db/client";

// Set VAPID details for web-push
webpush.setVapidDetails(
  "mailto:admin@hotdrop.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushToPartner(partnerId: string, payload: any) {
  // Get all push subscriptions for this partner
  const subscriptions = await prismaClient.pushSubscription.findMany({
    where: { partnerId },
  });
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys,
        },
        JSON.stringify(payload)
      );
    } catch (err) {
      // Optionally: handle unsubscribed endpoints
      console.error("Push send error", err);
    }
  }
}
