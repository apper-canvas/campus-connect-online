import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-primary-800 to-primary-700 text-white hover:brightness-105 focus:ring-primary-500 shadow-md hover:shadow-lg",
      secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:brightness-105 focus:ring-secondary-500 shadow-md hover:shadow-lg",
      outline: "border-2 border-primary-800 text-primary-800 hover:bg-primary-50 focus:ring-primary-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
      danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:brightness-105 focus:ring-red-500 shadow-md hover:shadow-lg",
      success: "bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:brightness-105 focus:ring-accent-500 shadow-md hover:shadow-lg",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;