import { useState, useEffect } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { RequestCard } from "@/components/ui/request-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { wrapRequest } from "@/utils/NetworkWrapper";
import { Request } from "@/types";

export function UserDashboard() {
    const { currentUser } = useAuth();
    const [userRequests, setUserRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!currentUser) return;

        const fetchRequests = async () => {
            setLoading(true);
            try {
                const res = await wrapRequest(`http://localhost:8080/api/v1/request/get-all?issuer=${currentUser.principalName}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    throw new Error("Failed to load requests");
                }
                const data = await res.json();
                console.log("data", data);
                setUserRequests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [currentUser]);

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
                        New Request
                    </Link>
                </Button>
            </div>

            {/* Error & Loading */}
            {loading && <p>Loading requests...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Пример карточки */}
                <Card>
                    <CardHeader>
                        <CardTitle>Total</CardTitle>
                        <CardDescription>{userRequests.length}</CardDescription>
                    </CardHeader>
                </Card>
                {/* сюда можно добавить остальные */}
            </div>

            {/* Recent Requests */}
            <div className="space-y-4">
                {userRequests.map((req) => (
                    <RequestCard key={req.id} request={req} />
                ))}
            </div>
        </div>
    );
}
