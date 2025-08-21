import { Request, RequestStatus } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface RequestCardProps {
  request: Request;
  isSelected?: boolean;
}

export function RequestCard({ request, isSelected }: RequestCardProps) {
  return (
    <Link to={`/request/${request.id}`}>
      <Card
        className={`cursor-pointer hover-lift transition-smooth ${
          isSelected ? "ring-2 ring-primary shadow-glow" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight truncate">
                {request.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={request.priority as RequestStatus} />
              </div>
            </div>

            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={""} alt={request.issuer} />
              <AvatarFallback className="text-xs">
                {request.issuer
                  .slice(0, request.issuer.indexOf("@"))
                  .split(".")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {request.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(request.created_at), {
                addSuffix: true,
              })}
            </div>

            <div className="flex items-center gap-1 font-medium">
              <span>
                {request.resolved ? "✅ Resolved" : "⏳ Not resolved"}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {request.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
