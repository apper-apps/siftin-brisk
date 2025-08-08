import React from "react";
import { cn } from "@/utils/cn";

const ProgressIndicator = ({ 
  steps, 
  currentStep, 
  className,
  onStepClick
}) => {
  return (
    <div className={cn("flex items-center justify-center space-x-4", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isClickable = onStepClick && stepNumber <= currentStep;

        return (
          <React.Fragment key={step}>
            <div 
              className={cn(
                "flex items-center",
                isClickable && "cursor-pointer"
              )}
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isActive && "bg-primary-500 text-white",
                  isCompleted && "bg-emerald-500 text-white",
                  !isActive && !isCompleted && "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                )}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span 
                className={cn(
                  "ml-2 text-sm font-medium hidden sm:block",
                  isActive && "text-primary-600 dark:text-primary-400",
                  isCompleted && "text-emerald-600 dark:text-emerald-400",
                  !isActive && !isCompleted && "text-gray-500 dark:text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-px w-8 sm:w-16 transition-colors",
                  stepNumber < currentStep ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;