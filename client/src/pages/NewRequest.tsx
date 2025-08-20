import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/layout/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { wrapRequest } from "@/utils/NetworkWrapper.ts";

export function NewRequest() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issuer: currentUser?.principalName,
    title: "",
    subcategory: "",
    priority: "normal",
    description: "",
    category: "",
    dc: "UNDEFINED",
    vlanId: "",
    vrf: "",
    subnet: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // если категория "New Project", то проверяем доп. поля
    if (formData.category === "newProject" && (!formData.subcategory || !formData.dc)) {
      toast.error("Please fill in all required fields for New Project");
      return;
    }

    setIsSubmitting(true);

    const response = await wrapRequest("http://localhost:8080/api/v1/request/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("response", response);

    if (!response.ok) {
      toast.error("Something went wrong .. Try again later");
      setIsSubmitting(false);
      return;
    }

    const data = await response.json();
    console.log(data);

    toast.success("Request submitted successfully!");
    navigate("/");
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover-glow"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Request</h1>
          <p className="text-muted-foreground">
            Submit a new request ticket
          </p>
        </div>
      </div>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Please provide as much detail as possible to help us assist you better
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of your request"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="transition-smooth focus:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="transition-smooth focus:shadow-glow">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newProject">New Project</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                  <SelectItem value="internetAccess">Internet Access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger className="transition-smooth focus:shadow-glow">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

            {/* Доп. поля только если категория = newProject */}
            {formData.category === "newProject" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => handleInputChange("subcategory", value)}
                  >
                    <SelectTrigger className="transition-smooth focus:shadow-glow">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prod">Prod</SelectItem>
                      <SelectItem value="preProd">Preprod</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dc">DC</Label>
                  <Select
                    value={formData.dc}
                    onValueChange={(value) => handleInputChange("dc", value)}
                  >
                    <SelectTrigger className="transition-smooth focus:shadow-glow">
                      <SelectValue placeholder="Select Datacenter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dc1">DC1</SelectItem>
                      <SelectItem value="dc2">DC2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 p-4 rounded-2xl shadow-sm border hover:shadow-md transition">
                  <Label htmlFor="vlanId" className="font-semibold">
                    VLAN ID
                  </Label>
                  <Input
                    id="vlanId"
                    placeholder="e.g. 100"
                    className="focus:shadow-glow transition-smooth"
                    value={formData.vlanId}
                    onChange={(e) => handleInputChange("vlanId", e.target.value)}
                  />
              </div>

              <div className="space-y-2 p-4 rounded-2xl shadow-sm border hover:shadow-md transition">
                <Label htmlFor="vrf" className="font-semibold">
                  VRF
                </Label>
                <Input
                  id="vrf"
                  placeholder="e.g. PROD_VRF"
                  className="focus:shadow-glow transition-smooth"
                  value={formData.vrf}
                  onChange={(e) => handleInputChange("vrf", e.target.value)}
                />
              </div>

              <div className="space-y-2 p-4 rounded-2xl shadow-sm border hover:shadow-md transition">
                <Label htmlFor="subnet" className="font-semibold">
                  Subnet
                </Label>
                <Input
                  id="subnet"
                  placeholder="e.g. 192.168.1.0/24"
                  className="focus:shadow-glow transition-smooth"
                  value={formData.subnet}
                  onChange={(e) => handleInputChange("subnet", e.target.value)}
                />
              </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe your request in detail..."
                className="min-h-32 transition-smooth focus:shadow-glow"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gradient-primary hover-glow"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
