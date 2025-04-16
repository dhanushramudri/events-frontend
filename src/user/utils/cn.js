// utils/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// utils/date.js
import { format, parseISO } from "date-fns";

export const formatDate = (dateString, formatString = "PPP") => {
  if (!dateString) return "";
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatDateTime = (dateString, formatString = "PPP p") => {
  if (!dateString) return "";
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "";
  }
};
