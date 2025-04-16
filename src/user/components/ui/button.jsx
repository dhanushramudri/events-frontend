import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-blue hover:bg-blue-700 shadow-sm border-1",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline:
          "border border-1 border-blue-400 border-gray-300  text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-black",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm",
        ghost:
          "text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-[inset_-1px_1px_1px_rgba(0,0,0,0.1),0px 2px 0px rgba(0, 0, 0, 0.1),0px -2px 0px rgba(0, 0, 0, 0.1)]", // Custom shadow for left, top, and bottom only
        link: "text-blue-600 underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md",
        white:
          "bg-white text-gray-800 hover:bg-gray-50 shadow-sm border border-gray-200",
        tab: "border-b-2 border-transparent border-blue- hover:border-blue-500 hover:text-blue-600",
        "tab-active": "border-b-2 border-blue-600 text-blue-600 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-8 px-3 py-1 rounded-md text-xs",
        lg: "h-12 px-6 py-3 rounded-lg text-base",
        xl: "h-14 px-8 py-4 rounded-lg text-lg",
        icon: "h-10 w-10 rounded-md",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-md",
        pill: "h-10 px-6 rounded-full",
        "pill-sm": "h-8 px-4 rounded-full text-xs",
        "pill-lg": "h-12 px-8 rounded-full text-base",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "auto",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, width, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, width, className }))} // Apply the variants dynamically
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
