import { AppDataSource } from "../data-source.js";
import { Item } from "../entities/Item.js";
import { sendPushNotification } from "./push.js";
import { isReplacementDue, reminderClock } from "./reminder-date.js";

// Prevent overlapping requests within this server instance.
let running = false;

// send a notification 9'o clock

export const runReminders = async () => {
  if (running) return { status: "busy" as const };
  running = true;
  try {
    const timeZone = process.env.REMINDER_TIMEZONE || "Australia/Brisbane";
    const clock = reminderClock(new Date(), timeZone);
    const repository = AppDataSource.getRepository(Item);
    const items = await repository.find();
    const totals = { sent: 0, expired: 0, failed: 0 };
    for (const item of items) {
      if (
        item.lastNotifiedOn === clock.date ||
        !isReplacementDue(item, clock.date)
      )
        continue;
      const result = await sendPushNotification({
        title: "Time for a replacement",
        body: `It's time to replace ${item.name}.`,
      });
      totals.sent += result.sent;
      totals.expired += result.expired;
      totals.failed += result.failed;
      // Record partial success too, so successful devices aren't repeatedly notified.
      if (result.sent > 0) {
        await repository.update(item.id, { lastNotifiedOn: clock.date });
      }
    }
    return { status: "completed" as const, ...totals };
  } finally {
    running = false;
  }
};
