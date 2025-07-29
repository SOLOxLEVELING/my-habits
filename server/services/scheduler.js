const cron = require("node-cron");
const db = require("../db");
const { sendReminderEmail } = require("./emailService");

const checkReminders = async () => {
  const nowUTC = new Date();
  const isoNow = nowUTC.toISOString();

  // Convert to Asia/Kolkata for logging
  const localTime = new Date(
    nowUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const hhmm = localTime.toTimeString().slice(0, 5); // e.g., "18:22"

  console.log(`[${isoNow}] 🕒 Cron job running...`);
  console.log(
    `[${isoNow}] 📝 Looking for reminders matching: ${hhmm} (Asia/Kolkata)`
  );

  try {
    // 1. Preview upcoming reminders (within next 5 minutes)
    const upcomingQuery = `
      SELECT
          h.name AS habit_name,
          u.email AS user_email,
          h.reminder_time,
          u.timezone
      FROM habits h
      JOIN users u ON h.user_id = u.id
      WHERE h.reminder_enabled = TRUE
        AND (
            h.frequency_type = 'daily'
            OR h.frequency_details->'days' @> to_jsonb(extract(isodow from NOW() AT TIME ZONE u.timezone))
        )
    `;

    const { rows: allReminders } = await db.query(upcomingQuery);

    // Filter and show "coming soon" reminders
    const upcoming = allReminders.filter((r) => {
      const userNow = new Date(
        nowUTC.toLocaleString("en-US", { timeZone: r.timezone })
      );

      const [reminderHour, reminderMin] = r.reminder_time
        .split(":")
        .map(Number);
      const reminderDate = new Date(userNow);
      reminderDate.setHours(reminderHour, reminderMin, 0, 0);

      const diffMs = reminderDate - userNow;
      const diffMin = Math.round(diffMs / 60000);

      return diffMin >= 0 && diffMin <= 5;
    });

    if (upcoming.length > 0) {
      console.log(`[${isoNow}] 🔔 Upcoming reminders:`);
      for (const u of upcoming) {
        console.log(
          `   - ${u.habit_name} for ${u.email} at ${u.reminder_time} (${u.timezone})`
        );
      }
    } else {
      console.log(`[${isoNow}] ℹ️ No upcoming reminders in next 5 minutes.`);
    }

    // 2. Send reminders for current minute
    const sendNowQuery = `
      SELECT
          h.name AS habit_name,
          u.email AS user_email,
          u.timezone
      FROM habits h
      JOIN users u ON h.user_id = u.id
      WHERE h.reminder_enabled = TRUE
        AND h.reminder_time::time = date_trunc('minute', NOW() AT TIME ZONE u.timezone)::time
        AND (
            h.frequency_type = 'daily'
            OR h.frequency_details->'days' @> to_jsonb(extract(isodow from NOW() AT TIME ZONE u.timezone))
        )
    `;

    const { rows } = await db.query(sendNowQuery);
    console.log(`[${isoNow}] ✅ Found ${rows.length} reminders to send.`);

    for (const reminder of rows) {
      console.log(
        `[${isoNow}] 📧 Sending email to ${reminder.user_email} for "${reminder.habit_name}"`
      );
      await sendReminderEmail(reminder.user_email, reminder.habit_name);
    }
  } catch (error) {
    console.error(`[${isoNow}] ❌ Error in cron job:`, error.message);
  }
};

const initScheduledJobs = () => {
  cron.schedule("*/1 * * * *", checkReminders, {
    scheduled: true,
    timezone: "UTC",
  });

  console.log(
    "Scheduler initialized with REAL email notifications. Cron job will run every minute."
  );
};

module.exports = { initScheduledJobs };
