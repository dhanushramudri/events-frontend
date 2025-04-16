import React from "react";

export const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-gray-800 dark:text-gray-100 ${className} border-blue border-1`}
    >
      {children}
    </span>
  );
};
