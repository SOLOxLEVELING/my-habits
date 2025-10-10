// scheduler.js

const cron = require("node-cron");
const db = require("../db");
// 👇 Imported the new notification service instead of the email service
const { sendNotification } = require("./notificationService");

const checkReminders = async () => {
  console.log(`[${new Date().toISOString()}] 🕒 Cron job running...`);

  try {
    // This query finds all habits that have a reminder due for the current minute
    // in the user's specific timezone.
    const query = `
      SELECT
          h.id AS habit_id,
          h.name AS habit_name,
          h.user_id
      FROM habits h
      JOIN users u ON h.user_id = u.id
      WHERE h.reminder_enabled = TRUE
        AND h.reminder_time IS NOT NULL
        -- Match the time in the user's timezone
        AND h.reminder_time::time = date_trunc('minute', NOW() AT TIME ZONE u.timezone)::time
        -- Check if it's a daily habit OR a weekly habit on the correct day
        AND (
            h.frequency_type = 'daily'
            OR h.frequency_details->'days' @> to_jsonb(extract(isodow from NOW() AT TIME ZONE u.timezone))
        )
    `;

    const { rows: reminders } = await db.query(query);

    if (reminders.length > 0) {
      console.log(
        `[${new Date().toISOString()}] ✅ Found ${
          reminders.length
        } reminders to send.`
      );

      for (const reminder of reminders) {
        // 👇 Instead of sending an email, send a browser notification
        sendNotification(reminder.user_id, {
          title: "Habit Reminder! ✨",
          body: `Time for your habit: "${reminder.habit_name}"`,
          icon: "/favicon.ico", // Optional: you can add a path to an icon
        });
      }
    } else {
      console.log(
        `[${new Date().toISOString()}] ℹ️ No reminders to send for this minute.`
      );
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] ❌ Error in cron job:`,
      error.message
    );
  }
};

const initScheduledJobs = () => {
  // Runs every minute
  cron.schedule("*/1 * * * *", checkReminders, {
    scheduled: true,
    timezone: "UTC",
  });
  console.log("Scheduler initialized for IN-BROWSER notifications.");
};

module.exports = { initScheduledJobs };
