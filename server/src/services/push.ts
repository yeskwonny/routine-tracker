import "../env.js";
import webpush from "web-push";
import { AppDataSource } from "../data-source.js";
import { Subscription } from "../entities/Subscription.js";

export interface PushMessage {
  title: string;
  body: string;
}

export interface PushResult {
  sent: number;
  expired: number;
  failed: number;
}

// Call after AppDataSource.initialize(). This sends to all saved subscriptions.
export async function sendPushNotification(
  message: PushMessage,
): Promise<PushResult> {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    throw new Error(
      "Push requires VAPID_SUBJECT, VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY",
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const repository = AppDataSource.getRepository(Subscription);
  const subscriptions = await repository.find();
  const payload = JSON.stringify(message);
  const result: PushResult = { sent: 0, expired: 0, failed: 0 };

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        },
        payload,
        { timeout: 10_000, TTL: 60 * 60 },
      );
      result.sent++;
    } catch (error: unknown) {
      const statusCode =
        typeof error === "object" && error !== null && "statusCode" in error
          ? error.statusCode
          : undefined;

      if (statusCode === 404 || statusCode === 410) {
        await repository.delete(subscription.id);
        result.expired++;
      } else {
        // Keep temporary failures for a later attempt. Avoid logging keys/endpoints.
        result.failed++;
        console.error("Push delivery failed", {
          subscriptionId: subscription.id,
          statusCode: typeof statusCode === "number" ? statusCode : undefined,
        });
      }
    }
  }

  return result;
}
