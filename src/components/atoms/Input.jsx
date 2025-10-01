import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 text-gray-900 bg-white border rounded-md transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "placeholder:text-gray-400",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 hover:border-gray-400",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;