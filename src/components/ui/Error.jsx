import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      className
    )}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Error occurred
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
        {message}
      </p>
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-4"
        >
          <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
          Try again
        </Button>
      )}
    </div>
  );
};

export default Error;