import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/layout/AuthProvider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Request } from "@/types";
import { wrapRequest } from "@/utils/NetworkWrapper";

interface AdminResponse {
  requestId: number;
  admin: string;
  adminResponse: string;
  status?: "CLOSED" | "REJECTED" | "RESPONDED";
}

interface SingleRequestFullResponse {
  userRequest: Request;
  adminResponse: AdminResponse | null;
}

export function RequestPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<SingleRequestFullResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState("");

  // Получение данных запроса
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await wrapRequest(
          `http://localhost:8080/api/v1/request/get-response/${id}`,
          { method: "GET" }
        );

        if (!res.ok) throw new Error("Failed to load request");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!data) return;

    const params = new URLSearchParams({
      id: data.userRequest.id.toString(),
      issuer: data.userRequest.issuer,
    });

    try {
      await wrapRequest(
        `http://localhost:8080/api/v1/request/deleteRequest?${params}`,
        { method: "DELETE" }
      );
      navigate("/");
      location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // Отправка ответа админа
  const handleAdminResponse = async (action?: "CLOSED" | "REJECTED") => {
    if (!id) return;

    const payload: AdminResponse = {
      requestId: Number(id),
      admin: currentUser?.fullName || "Admin",
      adminResponse: responseText || action || "",
      status: action || "RESPONDED",
    };

    try {
      await wrapRequest(`http://localhost:8080/api/v1/request/send-admin-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setResponseText("");

      // обновляем данные после ответа
      const res = await wrapRequest(
        `http://localhost:8080/api/v1/request/get-response/${id}`,
        { method: "GET" }
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!data) return <p className="p-6 text-red-500">Request not found</p>;

  const { userRequest, adminResponse } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Информация о запросе */}
      <Card>
        <CardHeader>
          <CardTitle>{userRequest.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><b>Category:</b> {userRequest.category}</p>
          <p><b>Subcategory:</b> {userRequest.subcategory}</p>
          <p><b>Priority:</b> {userRequest.priority}</p>
          <p><b>Description:</b> {userRequest.description}</p>
          <p><b>Data Center:</b> {userRequest.dc}</p>
          <p><b>VLAN ID:</b> {userRequest.vlanId}</p>
          <p><b>VRF:</b> {userRequest.vrf}</p>
          <p><b>Subnet:</b> {userRequest.subnet}</p>
          <p><b>Status:</b> {userRequest.resolved ? "Resolved" : "Open"}</p>
          <p><b>Issuer:</b> {userRequest.issuer}</p>
        </CardContent>
        <CardFooter>
            {
                currentUser?.role !== "ADMIN" && (
                    <Button onClick={handleDelete} variant="destructive" className="mt-3">
                    Delete Request
                    </Button>
                )
            }
            
        </CardFooter>
      </Card>

      {/* Ответ админа для юзера */}
      {currentUser?.role === "USER" && currentUser?.preferedDashboard !== "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Response</CardTitle>
          </CardHeader>
          <CardContent>
            {adminResponse ? (
              <div className="space-y-2">
                <p><b>Status:</b> {adminResponse.status}</p>
                <p><b>Admin:</b> {adminResponse.admin}</p>
                <p>{adminResponse.adminResponse}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No response yet</p>
            )}
        
          </CardContent>
        </Card>
      )}

      {/* Форма админа */}
      {currentUser?.role === "ADMIN" && currentUser?.preferedDashboard === "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle>Respond to Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
            />
            <div className="flex gap-2">
              <Button onClick={() => handleAdminResponse("REJECTED")} variant="destructive">
                Reject
              </Button>
              <Button onClick={() => handleAdminResponse("CLOSED")} className="gradient-primary">
                Close Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
