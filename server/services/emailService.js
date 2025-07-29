const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Create a "transporter" object using the Ethereal SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Email ENV:", {
  host: process.env.EMAIL_HOST,
  user: process.env.EMAIL_USER,
});

/**
 * Sends a reminder email.
 * @param {string} to - The recipient's email address.
 * @param {string} habitName - The name of the habit for the reminder.
 */
const sendReminderEmail = async (to, habitName) => {
  const subject = `Habit Reminder! ✨`;
  const text = `This is your friendly reminder to complete your habit: "${habitName}"`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Habit Reminder! ✨</h2>
      <p>This is your friendly reminder to complete your habit:</p>
      <p style="font-size: 1.2em; font-weight: bold;">"${habitName}"</p>
      <p>You've got this!</p>
    </div>
  `;

  try {
    // Send the email
    let info = await transporter.sendMail({
      from: `"Habit Tracker" <noreply@habittracker.com>`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log(
      `  -> Email sent successfully for habit "${habitName}" to ${to}`
    );
    // You can see the preview of your email by clicking this link!
    console.log("   Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error(`Failed to send email for ${habitName}:`, error);
    return false;
  }
};

module.exports = { sendReminderEmail };
