// utils/emailSender.js
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID_NOTIFICATION = import.meta.env
  .VITE_EMAILJS_TEMPLATE_ID_NOTIFICATION;
const TEMPLATE_ID_AUTOREPLY = import.meta.env
  .VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY;
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

export const sendNotificationEmail = async ({
  toName,
  toEmail,
  message,
  eventName,
}) => {
  try {
    const templateParams = {
      to_name: toName,
      to_email: toEmail,
      message,
      event_name: eventName,
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_NOTIFICATION,
      templateParams,
      USER_ID
    );

    console.log("Notification Email sent:", result.text);
    return result;
  } catch (error) {
    console.error("Failed to send notification email:", error);
    throw error;
  }
};

export const sendAutoReplyEmail = async ({ toName, toEmail, eventName }) => {
  try {
    const templateParams = {
      to_name: toName,
      to_email: toEmail,
      event_name: eventName,
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_AUTOREPLY,
      templateParams,
      USER_ID
    );

    console.log("Auto-reply Email sent:", result.text);
    return result;
  } catch (error) {
    console.error("Failed to send auto-reply email:", error);
    throw error;
  }
};
