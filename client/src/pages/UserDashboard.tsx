import { Request } from "@/types";
import { useAuth } from "@/components/layout/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserDashboardProps {
  data: Request[];
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-yellow-100 text-yellow-800",
  urgent: "bg-red-100 text-red-800",
};

export function UserDashboard({ data }: UserDashboardProps) {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const priorities = ["low", "normal", "high", "urgent"];

  const stats = priorities.map(p => ({
    priority: p,
    count: data.filter(el => el.priority === p).length,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser.fullName}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your requests and track their progress
          </p>
        </div>
        <Button asChild className="gradient-primary hover-glow">
          <Link to="/new-request" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
            <CardDescription>{data.length}</CardDescription>
          </CardHeader>
        </Card>

        {stats.map(stat => (
          <Card key={stat.priority} className={cn("overflow-hidden", PRIORITY_COLORS[stat.priority])}>
            <CardHeader>
              <CardTitle className="capitalize">{stat.priority} Priority</CardTitle>
              <CardDescription className="text-lg font-bold">{stat.count}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
