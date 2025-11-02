import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { TOKEN_KEY } from "./api"; 
import { LoginRequest, LoginResponse } from "../types/login";

export const ROLE_KEY = "@AppName:role";

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await api.post<LoginResponse>(
                "/auth/login",
                credentials,
            );
            const { token, role } = response.data;
            
            await Promise.all([
                AsyncStorage.setItem(TOKEN_KEY, token),
                AsyncStorage.setItem(ROLE_KEY, role),
            ]);
            
            return response.data;
        } catch (error) {
            console.error("Erro no serviço de login:", error);
            throw error;
        }
    },
    
    logout: async () => {
        await Promise.all([
            AsyncStorage.removeItem(TOKEN_KEY),
            AsyncStorage.removeItem(ROLE_KEY),
        ]);
    },

    getUserSession: async (): Promise<{
        token: string | null;
        role: string | null;
    }> => {
        const [token, role] = await Promise.all([
            AsyncStorage.getItem(TOKEN_KEY),
            AsyncStorage.getItem(ROLE_KEY),
        ]);
        return { token, role };
    },
};
