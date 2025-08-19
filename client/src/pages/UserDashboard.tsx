import { useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { RequestCard } from "@/components/ui/request-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockRequests } from "@/lib/mockData";
import { Plus, MessageSquare, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export function UserDashboard() {
    const { currentUser } = useAuth();
    const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
    const [userRequests, setUsersRequests] = useState<RequestCard[]>([]);

    // 👇 временный мок для статистики
    const stats = {
        total: 0,
        pending: 0,
        resolved: 0,
        urgent: 0,
    };

    if (!currentUser) return null;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {currentUser.fullName}</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your requests and track their progress
                    </p>
                </div>
                <Button asChild className="gradient-primary hover-glow">
                    <Link to="/new-request">
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* ... остальной код без изменений */}
            </div>

            {/* Recent Requests */}
            {/* ... */}
        </div>
    );
}
