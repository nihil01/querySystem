import { useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { RequestCard } from "@/components/ui/request-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Request } from "@/types";
import { CheckCircle, Timer, TrendingUp, AlertTriangle, MessageSquare } from "lucide-react";
import { wrapRequest } from "@/utils/NetworkWrapper";

interface AdminDashboardProps {
  data: Request[];
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const { currentUser } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");

  if (!currentUser || currentUser.role !== "ADMIN") return null;

  const stats = {
    total: data.length,
    resolved: data.filter(r => r.resolved).length,
    pending: data.filter(r => !r.resolved && r.priority !== "urgent").length,
    urgent: data.filter(r => r.priority === "urgent" && !r.resolved).length,
    new: data.filter(r => !r.resolved).length
  };

  const selectedRequest = data.find(r => r.id === selectedRequestId);

  const handleSelectRequest = (id: number) => setSelectedRequestId(id);

  const handleAdminResponse = async () => {
    if (!selectedRequest || !responseText.trim()) return;

    try {
      await wrapRequest(`/api/v1/request/send-admin-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          admin: currentUser.fullName,
          adminResponse: responseText
        })
      });

      setResponseText("");
      // обновить данные локально, либо перезагрузить панель
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      await wrapRequest(`/api/v1/request/deleteRequest?id=${selectedRequest.id}&issuer=${selectedRequest.issuer}`, {
        method: "DELETE"
      });

      setSelectedRequestId(null);
      // обновить данные локально после удаления
    } catch (err) {
      console.error(err);
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Requests</CardTitle>
            <CardDescription>Select a request to respond</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onClick={() => handleSelectRequest(req.id)}
                isSelected={selectedRequestId === req.id}
              />
            ))}
          </CardContent>
        </Card>

        {selectedRequest && (
          <Card className="lg:col-span-2 hover-lift">
            <CardHeader>
              <CardTitle>{selectedRequest.title}</CardTitle>
              <CardDescription>
                Priority: {selectedRequest.priority} | Status: {selectedRequest.resolved ? "Resolved" : "Open"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><b>Category:</b> {selectedRequest.category}</p>
              <p><b>Subcategory:</b> {selectedRequest.subcategory}</p>
              <p><b>Description:</b> {selectedRequest.description}</p>
              <p><b>Issuer:</b> {selectedRequest.issuer}</p>

              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response..."
              />

              <div className="flex gap-2">
                <Button onClick={handleAdminResponse} className="gradient-primary">
                  Send Response
                </Button>
                <Button onClick={handleRejectRequest} variant="destructive">
                  Reject Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
