export const reminderClock = (now: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    hour: Number(part("hour")),
  };
};

export const isReplacementDue = (
  item: { lastReplacedAt: string; cycleDays: number },
  today: string,
): boolean => {
  if (!Number.isInteger(item.cycleDays) || item.cycleDays <= 0) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.lastReplacedAt)) return false;
  const last = new Date(`${item.lastReplacedAt}T00:00:00.000Z`);
  if (
    !Number.isFinite(last.getTime()) ||
    last.toISOString().slice(0, 10) !== item.lastReplacedAt
  )
    return false;
  last.setUTCDate(last.getUTCDate() + item.cycleDays);
  return (
    Number.isFinite(last.getTime()) && last.toISOString().slice(0, 10) <= today
  );
};
