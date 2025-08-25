import React, { useState, useMemo } from "react";
import { Request } from "@/types";
import { RequestCard } from "@/components/ui/request-card";
import { Input } from "@/components/ui/input";

interface MyReqProps {
    data: Request[];
}

export const MyRequests = ({ data }: MyReqProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRequests = useMemo(() => {
        if (!searchQuery) return data;
        const q = searchQuery.toLowerCase();
        return data.filter(
            (req) =>
                req.title?.toLowerCase().includes(q) ||
                req.category?.toLowerCase().includes(q) ||
                req.subcategory?.toLowerCase().includes(q) ||
                req.issuer?.toLowerCase().includes(q) ||
                req.description?.toLowerCase().includes(q)
        );
    }, [data, searchQuery]);

    return (
        <div className="space-y-6 w-full">
            {/* Поиск */}
            <Input
                type="text"
                placeholder="Search your requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
            />

            {/* Листинг */}
            <div className="space-y-4 w-full">
                {filteredRequests.length === 0 ? (
                    <p className="text-sm text-gray-500">No requests found</p>
                ) : (
                    filteredRequests.map((req) => (
                        <RequestCard key={req.id} request={req} />
                    ))
                )}
            </div>
        </div>
    );
};
