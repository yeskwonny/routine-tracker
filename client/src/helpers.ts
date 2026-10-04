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

const urlBase64ToUint8Array = (
  base64String: string,
): Uint8Array<ArrayBuffer> => {
  if (!base64String.length) {
    throw new Error("VAPID public key is missing");
  }

  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("It doesn't suuport push notification");
    return null;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return null;
  }
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      import.meta.env.VITE_VAPID_PUBLIC_KEY,
    ),
  });

  return subscription;
};
