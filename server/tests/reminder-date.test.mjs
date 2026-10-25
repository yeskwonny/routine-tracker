import assert from "node:assert/strict";
import { test } from "node:test";
import { isReplacementDue, reminderClock } from "../dist/services/reminder-date.js";

test("Brisbane reminders use the local date and 9am boundary", () => {
  assert.deepEqual(reminderClock(new Date("2026-10-24T22:59:00Z"), "Australia/Brisbane"), {
    date: "2026-10-25", hour: 8,
  });
  assert.deepEqual(reminderClock(new Date("2026-10-24T23:00:00Z"), "Australia/Brisbane"), {
    date: "2026-10-25", hour: 9,
  });
});

test("replacement becomes due on its calendar date and stays due afterward", () => {
  const item = { lastReplacedAt: "2026-10-01", cycleDays: 24 };
  assert.equal(isReplacementDue(item, "2026-10-24"), false);
  assert.equal(isReplacementDue(item, "2026-10-25"), true);
  assert.equal(isReplacementDue(item, "2026-10-26"), true);
});

test("calendar arithmetic crosses leap days and year boundaries", () => {
  assert.equal(isReplacementDue({ lastReplacedAt: "2024-02-28", cycleDays: 2 }, "2024-02-29"), false);
  assert.equal(isReplacementDue({ lastReplacedAt: "2024-02-28", cycleDays: 2 }, "2024-03-01"), true);
  assert.equal(isReplacementDue({ lastReplacedAt: "2025-12-31", cycleDays: 1 }, "2026-01-01"), true);
});

test("invalid dates and cycles do not trigger notifications", () => {
  for (const lastReplacedAt of ["invalid", "2026-02-30", "2026-13-01"]) {
    assert.equal(isReplacementDue({ lastReplacedAt, cycleDays: 1 }, "2026-10-25"), false);
  }
  for (const cycleDays of [0, -1, 1.5, NaN]) {
    assert.equal(isReplacementDue({ lastReplacedAt: "2026-01-01", cycleDays }, "2026-10-25"), false);
  }
});
