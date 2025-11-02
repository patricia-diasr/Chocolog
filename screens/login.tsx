import React, { useState } from "react";
import { Box, Center } from "native-base";
import { AxiosError } from "axios";
import LoginForm from "../components/login/LoginForm";
import LoginBackground from "../components/login/LoginBackground";
import { authService } from "../services/authService";
import { useCustomToast } from "../contexts/ToastProvider";
import { LoginRequest } from "../types/login";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
    const { login, isLoading } = useAuth();
    const toast = useCustomToast();

    const handleLoginSubmit = async (credentials: LoginRequest) => {
        try {
            await login(credentials);
        } catch (error) {
            console.log("Falha no handleLoginSubmit do LoginScreen");
        }
    };

    return (
        <Box flex={1} position="relative">
            <LoginBackground />
            <Center flex={1} px={4}>
                <LoginForm
                    onLoginSubmit={handleLoginSubmit}
                    isLoading={isLoading}
                />
            </Center>
        </Box>
    );
}
