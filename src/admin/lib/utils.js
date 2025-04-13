// utils.js
export function cn(...inputs) {
  return inputs
    .filter(Boolean) // removes falsey values like undefined, null, false
    .join(" ")
    .trim();
}
