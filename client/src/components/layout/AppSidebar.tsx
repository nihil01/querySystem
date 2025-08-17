import { NavLink, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "./AuthProvider";
import {
    Home,
    MessageSquare,
    Plus,
    FileText,
    NetworkIcon,
} from "lucide-react";
import React from "react";

export function AppSidebar() {
    const { state } = useSidebar();
    const location = useLocation();
    const { currentUser } = useAuth();
    const collapsed = state === 'collapsed';

    const userItems = [
        { title: "Dashboard", url: "/", icon: Home },
        { title: "My Requests", url: "/my-requests", icon: FileText },
        { title: "New Request", url: "/new-request", icon: Plus },
    ];

    const adminItems = [
        { title: "Dashboard", url: "/", icon: Home },
        { title: "All Requests", url: "/admin/requests", icon: MessageSquare },
        { title: "Şəbəkə monitorinqi", url: "/admin/users", icon: NetworkIcon },
    ];

    const items = currentUser?.role === 'ADMIN' ? adminItems : userItems;

    const getNavCls = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "bg-blue-100 text-blue-600 font-medium shadow-glow"
            : "text-blue-600 hover:bg-blue-50 transition-smooth";

    const openNetworkMonitoring = () => {
        // создаём форму для безопасного POST
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "http://localhost:9070/api/auth/login";
        form.target = "_blank";

        // скрыто передаём токен в теле формы
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token";
        input.value = localStorage.getItem("token") || "";
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    return (
        <Sidebar
            className={`${collapsed ? "w-14" : "w-60"} border-r`}
            style={{ backgroundColor: "#f9fafb", color: "#111827" }}
            collapsible="icon"
        >
            <SidebarTrigger className="transition-smooth hover-glow m-2 self-end text-blue-600" />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground">
                        {currentUser?.role === 'ADMIN' ? 'Admin Panel' : 'User Portal'}
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            to={item.url}
                                            end
                                            className={getNavCls}
                                            onClick={(e) => {
                                                if (item.title === "Şəbəkə monitorinqi") {
                                                    e.preventDefault();
                                                    openNetworkMonitoring();
                                                }
                                            }}
                                        >
                                            <item.icon className="mr-2 h-4 w-4" style={{ color: "inherit" }} />
                                            {!collapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
