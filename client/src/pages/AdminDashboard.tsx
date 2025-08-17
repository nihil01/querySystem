import { useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { RequestCard } from "@/components/ui/request-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRequests } from "@/lib/mockData";
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users,
  TrendingUp,
  Timer
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AdminDashboard() {
  const { currentUser } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

    const stats = {
        total: 0,
        pending: 0,
        resolved: 0,
        urgent: 0,
    };

  if (!currentUser || currentUser.role !== 'ADMIN') return null;

  const resolvedPercentage = Math.round((stats.resolved / stats.total) * 100);
  const pendingRequests = mockRequests.filter(req => req.status === 'pending' || req.status === 'urgent');
  const recentRequests = mockRequests.slice(0, 4);

    return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all customer requests
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Timer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending + stats.urgent}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{resolvedPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">
              Immediate action needed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Overview */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Request Status Overview</CardTitle>
            <CardDescription>Current distribution of all requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  Resolved
                </span>
                <span className="font-medium">{stats.resolved}</span>
              </div>
              <Progress value={(stats.resolved / stats.total) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  Pending
                </span>
                <span className="font-medium">{stats.pending}</span>
              </div>
              <Progress value={(stats.pending / stats.total) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-info"></div>
                  New
                </span>
                <span className="font-medium">{stats.new}</span>
              </div>
              <Progress value={(stats.new / stats.total) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  Urgent
                </span>
                <span className="font-medium">{stats.urgent}</span>
              </div>
              <Progress value={(stats.urgent / stats.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Requests Requiring Attention</CardTitle>
            <CardDescription>
              {pendingRequests.length} requests need your response
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  No pending requests at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onClick={() => setSelectedRequest(request.id)}
                    isSelected={selectedRequest === request.id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            Latest requests from all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {recentRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => setSelectedRequest(request.id)}
                isSelected={selectedRequest === request.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}