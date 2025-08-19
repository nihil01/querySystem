import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
    currentUser: User | null;
    login: (role: UserRole, email: string, password:string) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        fetch("http://localhost:8080/api/v1/auth/verify", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Token invalid");
                return res.json();
            })
            .then((data: User) => {
                setCurrentUser(data);
            })
            .catch(() => {
                setCurrentUser(null);
                localStorage.removeItem("token");
            });
    }, []);

    const login = async (role: UserRole, email: string, password:string) => {
        const response = await fetch("http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "principal": email,
                "password": password,
                "role": role
            }),
        });

        if (!response.ok) {
            return alert("İstifadəçi tapılmadı! Və ya səhv məlumat göndərilib!")
        }

        const data: User = await response.json();
        console.log(data)

        console.log("Selected role " + role);
        console.log("User role " + data.role);

        if (data && data.refreshToken) {
            if (data.role === role) {
                setCurrentUser(data);
            } else {
                data.role = "USER";
                setCurrentUser(data);
            }

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("token");
    };

    const isLoggedIn = currentUser !== null;

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
