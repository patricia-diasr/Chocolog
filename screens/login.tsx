import React, { useState } from "react";
import { Box, Center } from "native-base";

import LoginForm, { LoginCredentials } from "../components/login/LoginForm";
import LoginBackground from "../components/login/LoginBackground";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLoginSubmit = (credentials: LoginCredentials) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1500);
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
