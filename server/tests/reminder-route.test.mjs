import assert from "node:assert/strict";
import { test } from "node:test";
import { createReminderHandler } from "../dist/routes/reminders.js";

test("endpoint authenticates before execution and reports results", async () => {
  const original = process.env.REMINDER_SECRET;
  let calls = 0;
  let result = { status: "completed", sent: 1, failed: 0, expired: 0 };
  const handler = createReminderHandler(async () => { calls++; return result; });
  const request = async (authorization) => {
    const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
    await handler({ get: () => authorization }, res, () => {});
    return res;
  };
  try {
    delete process.env.REMINDER_SECRET;
    assert.equal((await request()).code, 503);
    process.env.REMINDER_SECRET = "test-secret";
    assert.equal((await request()).code, 401);
    assert.equal((await request("Bearer wrong")).code, 401);
    assert.equal(calls, 0);
    const success = await request("Bearer test-secret");
    assert.equal(success.code, 200);
    assert.equal(success.body.sent, 1);
    assert.equal(calls, 1);
    result = { status: "busy" };
    assert.equal((await request("Bearer test-secret")).code, 409);
    result = { status: "completed", failed: 1 };
    assert.equal((await request("Bearer test-secret")).code, 502);
  } finally {
    if (original === undefined) delete process.env.REMINDER_SECRET;
    else process.env.REMINDER_SECRET = original;
  }
});
