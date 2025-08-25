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
    dc: "",
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
    location.reload();
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
      console.log(field)
      console.log(value)
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

              {formData.category === "newProject" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                          <Label>Subcategory</Label>
                          <div className="flex flex-col gap-2">
                              {["prod", "preProd", "test"].map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                      <input
                                          type="checkbox"
                                          id={option}
                                          checked={formData.subcategory?.includes(option)}
                                          onChange={(e) => {
                                              const newValue = e.target.checked
                                                  ? [...(formData.subcategory || []), option]
                                                  : formData.subcategory.filter((v: string) => v !== option);
                                              handleInputChange("subcategory", newValue);
                                          }}
                                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                      />
                                      <Label htmlFor={option} className="text-sm capitalize">
                                          {option}
                                      </Label>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-2">
                          <Label>DC</Label>
                          <div className="flex flex-col gap-2">
                              {["dc1", "dc2"].map((dc) => (
                                  <div key={dc} className="flex items-center space-x-2">
                                      <input
                                          type="checkbox"
                                          id={dc}
                                          checked={formData.dc?.includes(dc)}
                                          onChange={(e) => {
                                              const newValue = e.target.checked
                                                  ? [...(formData.dc || []), dc]
                                                  : formData.dc.filter((v: string) => v !== dc);
                                              handleInputChange("dc", newValue);
                                          }}
                                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                      />
                                      <Label htmlFor={dc} className="text-sm uppercase">
                                          {dc}
                                      </Label>
                                  </div>
                              ))}
                          </div>
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
