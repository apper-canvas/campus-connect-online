import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
      success: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800",
      warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
      danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
      info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;