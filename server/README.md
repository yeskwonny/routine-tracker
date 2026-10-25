# Replacement reminders

An external scheduling service calls the server every day at 9 AM Brisbane time.
The server finds items that are due or overdue and sends push notifications.
It skips items that already received a notification today.

There is no timer inside the server. Starting the server does not send reminders.

## Setup

1. Create a secret by running this in your terminal:

   ```bash
   openssl rand -hex 32
   ```

2. Save the same secret in your local `server/.env` and Railway server Variables:

   ```env
   REMINDER_SECRET=your-generated-secret
   REMINDER_TIMEZONE=Australia/Brisbane
   ```

3. Deploy the code to Railway.
4. Create a daily job in your external scheduling service with these settings:

   | Setting | Value |
   | --- | --- |
   | URL | `https://your-railway-domain/reminders/run` |
   | Request method | `POST` |
   | Time | Every day at 9 AM |
   | Timezone | `Australia/Brisbane` |
   | Header name | `Authorization` |
   | Header value | `Bearer your-generated-secret` |

The secret in the request must match `REMINDER_SECRET` on Railway.
Keep it out of frontend code, GitHub, and URLs.

The server uses Brisbane time if `REMINDER_TIMEZONE` is not set.
If your scheduling service only supports UTC, use **11 PM UTC every day**.
That is 9 AM the next day in Brisbane. The cron expression is `0 23 * * *`.
`REMINDER_HOUR` is no longer used.

The external service controls when requests are sent. An authorized request can
also send reminders at other times, such as during a manual test.

## Push notification settings

Your Railway server also needs these existing environment variables:

- `VAPID_SUBJECT`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

A device must allow notifications and have its push subscription saved first.
Currently, all subscribed devices receive reminders for all items.

## Response codes

| Code | Meaning |
| --- | --- |
| `200` | Check completed, even if no items are due or no devices are subscribed. |
| `401` | The request secret is missing or incorrect. |
| `503` | The server secret has not been configured. |
| `409` | Another reminder run is still in progress. |
| `502` | Some push deliveries failed. |
| `500` | An error occurred while running reminders. |

The response includes delivery counts: `sent`, `expired`, and `failed`.
These count successful sends, expired subscriptions, and failed sends across
items and devices.

## Duplicate notifications and retries

If at least one device receives a notification, the item is marked as sent today.
To avoid sending duplicates to successful devices, failed devices are not retried
for that item on the same day.

If every delivery fails, a later request can try again.
Automatic retries must be configured in the external scheduling service.

Overlapping runs are blocked within one server process. Multiple server instances
can still send duplicates. A crash after sending but before saving the date to
the database can also cause a duplicate notification.

## Tests

Run this from the `server` folder:

```bash
npm test
```

This builds the server and tests date calculations and API authentication.
