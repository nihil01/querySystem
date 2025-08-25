import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/layout/AuthProvider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Request } from "@/types";
import { wrapRequest } from "@/utils/NetworkWrapper";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

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

  const [vlanId, setVlanId] = useState<string>("");
  const [vrf, setVrf] = useState<string>("");
  const [subnet, setSubnet] = useState<string>("");

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

    try {

        await wrapRequest("http://localhost:8080/api/v1/request/manage-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requestId: id,
                adminResponse: responseText,
                state: action,
                subnet: subnet,
                vlanId: vlanId,
                vrf: vrf,
            }),
        })

        setResponseText("");

        navigate("/");
        location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!data) return <p className="p-6 text-red-500">Request not found</p>;

  const { userRequest, adminResponse } = data;

    console.log(userRequest);

    function formatPgArray(arr: string[]): string[]{

        const newArr = [];

        for (let i = 0; i < arr.length; i++) {

            newArr.push(
                arr[i].replace(/[{}]/g, "")
            );

        }

        return newArr;
    }

  return (
    <div className="p-6 space-y-6">
      {/* Информация о запросе */}
      <Card>
        <CardHeader>
          <CardTitle>{userRequest.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><b>Category:</b> {userRequest.category}</p>
          <p><b>Subcategory:</b> {formatPgArray(userRequest.subcategory).join(", ")}</p>
          <p><b>Priority:</b> {userRequest.priority}</p>
          <p><b>Description:</b> {userRequest.description}</p>
          <p><b>Data Center:</b> {formatPgArray(userRequest.dc).join(", ")}</p>
          <p><b>Status:</b> {userRequest.resolved ? "Resolved" : "Not resolved"}</p>
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
      {currentUser?.role === "USER"  && (
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
      {currentUser?.role === "ADMIN" && (
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

              <div className="space-y-2">
                  <Label htmlFor="ip">IP</Label>
                  <Input
                      id="ip"
                      placeholder="Ip address"
                      value={subnet}
                      onChange={(e) => setSubnet(e.target.value)}
                      className="transition-smooth focus:shadow-glow"
                  />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="vrf">VRF</Label>
                  <Input
                      id="vrf"
                      placeholder="Vrf name"
                      value={vrf}
                      onChange={(e) => setVrf(e.target.value)}
                      className="transition-smooth focus:shadow-glow"
                  />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="title">VLAN ID</Label>
                  <Input
                      id="title"
                      placeholder="Vlan id"
                      value={vlanId}
                      onChange={(e) => setVlanId(e.target.value)}
                      className="transition-smooth focus:shadow-glow"
                  />
              </div>


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
