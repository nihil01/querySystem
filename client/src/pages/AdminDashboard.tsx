import { useAuth } from "@/components/layout/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Request, SingleRequestFullResponse} from "@/types";
import { Timer, TrendingUp, AlertTriangle, MessageSquare } from "lucide-react";

interface AdminDashboardProps {
  data: SingleRequestFullResponse[];
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== "ADMIN") return null;


    const stats = {
        total: 0,
        resolved: 0,
        pending: 0,
        urgent: 0
    };

    (function calculateStats(){

      for (let i = 0 ; i < data.length ; i++){

          const response = data[i];

          stats.total ++;

          if (response.userRequest.resolved) stats.resolved++;

          if (!response.userRequest.resolved) stats.pending++;

          if (response.userRequest.priority === "urgent") stats.urgent++;

      }
  }())

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total requests in system</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Timer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending + stats.urgent}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{Math.round((stats.resolved / stats.total) * 100)}%</div>
            <p className="text-xs text-muted-foreground">Resolved requests percentage</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgent Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
