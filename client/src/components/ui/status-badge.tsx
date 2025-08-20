import { cn } from "@/lib/utils";
import { RequestStatus } from "@/types";
import { getStatusColor } from "@/lib/mockData";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "normal":
        return "bg-green-100 text-green-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-smooth",
        getCategoryColor(status),
        className
      )}
    >
      {status}
    </span>
  );
}