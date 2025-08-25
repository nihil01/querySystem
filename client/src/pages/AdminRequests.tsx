import React, { useState, useMemo } from "react";
import { SingleRequestFullResponse } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestCard } from "@/components/ui/request-card";
import { Input } from "@/components/ui/input";
import { wrapRequest } from "@/utils/NetworkWrapper.ts";

interface AdminRequestsProps {
    data?: SingleRequestFullResponse[];
}

export const AdminRequests: React.FC<AdminRequestsProps> = ({ data = [] }) => {
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [responseText, setResponseText] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const selectedRequestFull = data.find((req) => req.userRequest.id === selectedRequestId);
    const selectedRequest = selectedRequestFull?.userRequest;
    const selectedAdminResponse = selectedRequestFull?.adminResponse;

    const handleSelectRequest = (id: number, resolved: boolean) => {
        if (!resolved) setSelectedRequestId(id);
    };

    const handleAdminResponse = async () => {
        if (!selectedRequest) return;

        await wrapRequest("http://localhost:8080/api/v1/request/send-admin-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requestId: selectedRequest.id,
                adminResponse: responseText,
            }),
        });

        setResponseText("");
    };

    const filteredRequests = useMemo(() => {
        if (!searchQuery) return data;
        const q = searchQuery.toLowerCase();
        return data.filter(({ userRequest, adminResponse }) =>
            userRequest.title?.toLowerCase().includes(q) ||
            userRequest.category?.toLowerCase().includes(q) ||
            userRequest.subcategory?.toLowerCase().includes(q) ||
            userRequest.issuer?.toLowerCase().includes(q) ||
            userRequest.description?.toLowerCase().includes(q) ||
            adminResponse?.admin?.toLowerCase().includes(q) ||
            adminResponse?.adminResponse?.toLowerCase().includes(q)
        );
    }, [data, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Поисковая строка */}
            <div className="flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Листинг заявок на всю ширину */}
            <Card className="hover-lift w-full">
                <CardHeader>
                    <CardTitle>Requests</CardTitle>
                    <CardDescription>
                        {filteredRequests.length} request(s) found
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {filteredRequests.length === 0 && (
                        <p className="text-sm text-gray-500">No requests available</p>
                    )}
                    {filteredRequests.map(({ userRequest, adminResponse }) => (
                        <div key={userRequest.id}>
                            <RequestCard
                                request={{ userRequest, adminResponse }}
                                onClick={() => handleSelectRequest(userRequest.id, userRequest.resolved || false)}
                                isSelected={selectedRequestId === userRequest.id}
                                className={userRequest.resolved ? "pointer-events-none opacity-60" : ""}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
};
