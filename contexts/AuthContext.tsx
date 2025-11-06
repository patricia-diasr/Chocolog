import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { AxiosError } from "axios";
import { authService } from "../services/authService";
import api from "../services/api";
import { useCustomToast } from "./ToastProvider";
import { LoginRequest } from "../types/login";

interface AuthContextData {
    isLoading: boolean;
    isAuthenticated: boolean;
    userRole: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useCustomToast();

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const { role } = await authService.login(credentials);
            setUserRole(role);
            setIsAuthenticated(true);
        } catch (error) {
            let description =
                "Não foi possível fazer o login. Tente novamente.";
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    description = "Login ou senha inválidos.";
                } else if (!error.response) {
                    description = "Não foi possível conectar ao servidor.";
                }
            }
            toast.showToast({
                title: "Erro no Login",
                description: description,
                status: "error",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = useCallback(async () => {
        await authService.logout();
        setUserRole(null);
        setIsAuthenticated(false);
    }, [setIsAuthenticated, setUserRole]);

    useEffect(() => {
        const loadSession = async () => {
            setIsLoading(true);
            try {
                const { token, role } = await authService.getUserSession();
                if (token && role) {
                    setIsAuthenticated(true);
                    setUserRole(role);
                }
            } catch (e) {
                console.error("Falha ao carregar sessão", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadSession();
    }, []);

    useEffect(() => {
        const interceptorId = api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    console.log("Token expirado ou inválido. Deslogando...");
                    logout();
                }
                return Promise.reject(error);
            },
        );

        return () => {
            api.interceptors.response.eject(interceptorId);
        };
    }, [logout]);
    return (
        <AuthContext.Provider
            value={{ isLoading, isAuthenticated, userRole, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
