import React from "react";
import clsx from "clsx";

const Label = ({ htmlFor, children, className, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "block text-sm font-medium text-gray-700 mb-1",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
