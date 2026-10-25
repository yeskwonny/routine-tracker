import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { SAVE_SUBSCRIPTION } from "../api/Subscription";
import { subscribeToPush } from "../helpers";

import { Spinner } from "./Spinner";

export const NotificationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [saveSubscription] = useMutation(SAVE_SUBSCRIPTION);

  const handleEnableNotifications = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const subscription = await subscribeToPush();
      if (!subscription) return;

      const subJson = subscription.toJSON();

      await saveSubscription({
        variables: {
          endpoint: subJson.endpoint,
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        },
      });

      setIsSubscribed(true);
    } catch {
      setError("Could not enable notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <p className="text-xs text-gray-400 text-center mt-4">
        Notifications enabled ✓
      </p>
    );
  }

  return (
    <>
      <button
        onClick={handleEnableNotifications}
        disabled={isLoading}
        aria-busy={isLoading}
        className="flex items-center justify-center gap-2 disabled:opacity-60 w-full text-xs text-gray-500 py-2 mt-4 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        {isLoading && <Spinner inline />}
        {isLoading ? "Enabling notifications…" : "Enable notifications"}
      </button>
      {error && <p role="alert" className="text-xs text-red-600 mt-2">{error}</p>}
    </>
  );
};
