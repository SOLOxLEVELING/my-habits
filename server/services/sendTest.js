const { sendReminderEmail } = require("./emailService");

// Replace with your test email (or use the one from your DB)
const testEmail = "test@example.com";

sendReminderEmail(testEmail, "🚀 Manual Habit Test")
  .then((success) => {
    console.log("Email send result:", success);
  })
  .catch((error) => {
    console.error("Error sending email:", error);
  });
