import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Bell } from "lucide-react";
import { useAuth } from "@/components/layout/AuthProvider";
import { wrapRequest } from "@/utils/NetworkWrapper";

export function Settings() {
  const { currentUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [slackNotifications, setSlackNotifications] = useState(true);

  // Инициализация из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("slackNotifications");
    if (saved !== null) {
      setSlackNotifications(saved === "YES");
    }
  }, []);

  const handleToggle = async (checked: boolean) => {
    setSlackNotifications(checked);
    const state = checked ? "YES" : "NO";
    
    // Сохраняем локально
    localStorage.setItem("slackNotifications", state);

    // Отправляем на бэкенд
    try {
      const response = await wrapRequest(
        `http://localhost:8080/api/v1/request/notifications?issuer=${encodeURIComponent(currentUser?.principalName || "")}&state=${state}`,
        {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update notification state");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not update notification settings on server");
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Можно добавить дополнительные действия при сохранении
    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and account settings
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Slack Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive slack notifications for new requests and updates
                </p>
              </div>
              <Switch
                checked={slackNotifications}
                onCheckedChange={handleToggle}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
