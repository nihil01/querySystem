import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/layout/AuthProvider";
import { UserRole } from "@/types";
import { User, Shield } from "lucide-react";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleLogin = () => {
        console.log("Logging in with:", { email, password});
        login( email, password);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                backgroundImage: "url('http://localhost:8080/static/dvx_background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div style={{ width: "100%", maxWidth: "28rem" }}>
                <div style={{ textAlign: "center", color: "#000" }}>
                    <div
                        style={{
                            margin: "0 auto 1rem",
                            height: "4rem",
                            width: "4rem",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: "blur(6px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={"http://localhost:8080/static/dvx.png"}
                            alt="logo"
                            style={{ maxHeight: "70%", maxWidth: "70%" }}
                        />
                    </div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                        Sorğu sisteminə xoş gəlmisiniz
                    </h1>
                    <p style={{ color: "#333", fontSize: "0.95rem" }}>
                        Sorğu idarəetmə sisteminə daxil olmaq üçün rolunuzu seçin
                    </p>
                </div>

                <Card
                    style={{
                        marginTop: "1.5rem",
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "1rem",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                        color: "#000",
                    }}
                >
                    <CardHeader>
                        <CardTitle>Daxil ol</CardTitle>
                        <CardDescription>Siz AD istifadəçi ilə daxil ola bilərsiniz</CardDescription>
                    </CardHeader>

                    <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@taxes.gov.az"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    padding: "0.5rem",
                                    borderRadius: "0.5rem",
                                    width: "100%",
                                    color: "#000",
                                }}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Şifrə</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    padding: "0.5rem",
                                    borderRadius: "0.5rem",
                                    width: "100%",
                                    color: "#000",
                                }}
                            />
                        </div>

                        <Button
                            onClick={handleLogin}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                background: "#2563eb",
                                color: "#fff",
                                fontWeight: 600,
                                borderRadius: "0.75rem",
                                marginTop: "0.5rem",
                            }}
                        >
                            Davam et
                        </Button>

                        <p style={{ fontSize: "0.75rem", textAlign: "center", color: "#666" }}>
                            From NetAdmins with 💙
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
