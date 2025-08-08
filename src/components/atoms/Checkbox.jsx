import React from "react";
import { cn } from "@/utils/cn";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={cn(
      "h-4 w-4 rounded border border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-primary-400",
      className
    )}
    ref={ref}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";

export default Checkbox;