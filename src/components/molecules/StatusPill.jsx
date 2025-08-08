import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusPill = ({ status, ...props }) => {
  const statusVariants = {
    Draft: "secondary",
    Running: "primary", 
    Completed: "success",
    Failed: "error",
    Queued: "warning",
    Sent: "success",
    Error: "error",
    Unknown: "secondary",
    Found: "success",
    NotFound: "error",
  };

  const variant = statusVariants[status] || "default";

  return (
    <Badge variant={variant} {...props}>
      {status}
    </Badge>
  );
};

export default StatusPill;