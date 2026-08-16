export const getDaysRemaining = (
  cycleDays: number,
  lastReplacedAt: string,
): number => {
  const last = new Date(lastReplacedAt);
  const dueDate = new Date(last);
  dueDate.setDate(dueDate.getDate() + cycleDays);

  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getStatus = (daysRemaining: number): "overdue" | "soon" | "ok" => {
  if (daysRemaining < 0) return "overdue";
  if (daysRemaining <= 3) return "soon";
  return "ok";
};
