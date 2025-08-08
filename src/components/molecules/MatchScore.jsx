import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const MatchScore = ({ score, className, size = "default" }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "accent";
    if (score >= 80) return "success";
    if (score >= 70) return "warning";
    return "secondary";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2 font-semibold",
  };

  return (
    <Badge 
      variant={getScoreColor(score)}
      className={cn(
        "font-medium",
        sizeClasses[size],
        className
      )}
    >
      {score}%
    </Badge>
  );
};

export default MatchScore;