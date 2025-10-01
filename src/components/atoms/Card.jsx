import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;