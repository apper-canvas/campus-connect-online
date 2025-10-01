import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = forwardRef(
  ({ className, src, alt, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "w-8 h-8 text-sm",
      md: "w-12 h-12 text-base",
      lg: "w-16 h-16 text-lg",
      xl: "w-24 h-24 text-2xl",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold overflow-hidden",
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <ApperIcon name="User" size={size === "sm" ? 16 : size === "md" ? 20 : size === "lg" ? 24 : 32} />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;