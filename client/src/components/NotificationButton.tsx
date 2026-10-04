import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { SAVE_SUBSCRIPTION } from "../api/subscription";
import { subscribeToPush } from "../helpers";

export const NotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [saveSubscription] = useMutation(SAVE_SUBSCRIPTION);

  const handleEnableNotifications = async () => {
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
  };

  if (isSubscribed) {
    return (
      <p className="text-xs text-gray-400 text-center mt-4">
        Notifications enabled ✓
      </p>
    );
  }

  return (
    <button
      onClick={handleEnableNotifications}
      className="w-full text-xs text-gray-500 py-2 mt-4 border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      Enable notifications
    </button>
  );
};
