import { createContext, useContext, useState, useEffect } from "react";

import { getCurrentUser, loginUser, logoutUser } from "../api/user";
import type { UserLoginRequest, UserResponse } from "../types/user";

interface AuthContextType {
  user: UserResponse | null;
  loadingUser: boolean;
  login: (requestData: UserLoginRequest) => Promise<UserResponse>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data);
            } catch (err) {
                if (user) {
                    logout();
                }
            } finally {
                setLoadingUser(false);
            }
        }
        handleFetch();
    }, []);

    const login = async (loginRequestData: UserLoginRequest): Promise<UserResponse> => {
        const { id, first_name, last_name, email } = await loginUser({email: loginRequestData.email, password: loginRequestData.password});
        const userData = {id: id, first_name: first_name, last_name: last_name, email: email}
        setUser(userData);
        return userData
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    const isAuthenticated = () => !!user && !loadingUser;

    return (
        <AuthContext.Provider value={{ user, loadingUser, login, logout, isAuthenticated  }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext)!;