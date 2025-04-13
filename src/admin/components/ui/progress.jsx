// components/ui/progress.jsx
import * as React from "react";

const Progress = React.forwardRef(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage =
      value !== undefined ? Math.min(Math.max(value, 0), max) : 0;

    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${
          className || ""
        }`}
        {...props}
      >
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
