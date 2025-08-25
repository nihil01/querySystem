import { SingleRequestFullResponse, RequestStatus } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface RequestCardProps {
    request: SingleRequestFullResponse;
    isSelected?: boolean;
}

export function RequestCard({ request, isSelected }: RequestCardProps) {
    const { userRequest, adminResponse } = request;

    console.log(userRequest, adminResponse);
    return (
        <Link
            to={userRequest.resolved ? "#" : `/request/${userRequest.id}`}
            className={userRequest.resolved ? "pointer-events-none" : ""}
        >
            <Card
                className={`cursor-pointer hover-lift transition-smooth ${
                    isSelected ? "ring-2 ring-primary shadow-glow" : ""
                }`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 mb-3">
                            <h4 className="font-semibold text-sm leading-tight truncate">
                                №{userRequest.id}
                            </h4>

                            <h2 className="font-semibold text-lg leading-tight truncate">
                                {userRequest.title}
                            </h2>
                            <div className="flex items-center gap-2 mt-3">
                                <StatusBadge status={userRequest.priority as RequestStatus} />
                            </div>
                        </div>

                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={""} alt={userRequest.issuer} />
                            <AvatarFallback className="text-xs">
                                {userRequest.issuer
                                    .slice(0, userRequest.issuer.indexOf("@"))
                                    .split(".")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {userRequest.description}
                    </p>

                    {adminResponse && (
                        <p className="text-sm text-primary line-clamp-2">
                            <b>Admin {adminResponse.admin}:</b> {adminResponse.adminResponse}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(userRequest.created_at), {
                                addSuffix: true,
                            })}
                        </div>

                        <div className="flex items-center gap-1 font-medium">
                      <span>
                        {userRequest.resolved ? "✅ Resolved" : "⏳ Not resolved"}
                      </span>
                        </div>
                    </div>

                    <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                            {userRequest.category}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
