import { cn } from "@/lib/utils";
import { RequestStatus } from "@/types";
import { getStatusColor } from "@/lib/mockData";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusLabel = (status: RequestStatus) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'pending':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'urgent':
        return 'Urgent';
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-smooth",
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}