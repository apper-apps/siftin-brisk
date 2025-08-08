import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5 }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700"></div>
            <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;