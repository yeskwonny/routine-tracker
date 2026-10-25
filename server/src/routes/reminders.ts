import { timingSafeEqual, createHash } from "node:crypto";
import type { RequestHandler } from "express";

type ReminderResult = {
  status: "busy" | "completed";
  sent?: number;
  expired?: number;
  failed?: number;
};

export const createReminderHandler =
  (run: () => Promise<ReminderResult>): RequestHandler =>
  async (req, res) => {
    const secret = process.env.REMINDER_SECRET;
    if (!secret?.trim()) {
      res.status(503).json({ error: "Reminder endpoint is not configured" });
      return;
    }
    const hash = (value: string) => createHash("sha256").update(value).digest();
    if (
      !timingSafeEqual(
        hash(req.get("authorization") ?? ""),
        hash(`Bearer ${secret}`),
      )
    ) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const result = await run();
      const status = result.status === "busy" ? 409 : result.failed ? 502 : 200;
      res.status(status).json(result);
    } catch (error) {
      console.error("Reminder execution failed", error);
      res.status(500).json({ error: "Reminder execution failed" });
    }
  };
