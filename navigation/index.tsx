import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useBreakpointValue, Spinner, Center } from "native-base";
import AuthNavigator from "./AuthNavigator";
import MobileNavigator from "./MobileNavigator";
import DesktopNavigator from "./DesktopNavigator";
import { useAuth } from "../contexts/AuthContext"; 

const LoadingScreen = () => (
    <Center flex={1}>
        <Spinner size="lg" />
    </Center>
);

export const Navigator = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const isMobile = useBreakpointValue({ base: true, md: false });

    if (isLoading) {
        return (
            <NavigationContainer>
                <LoadingScreen />
            </NavigationContainer>
        );
    }

    const renderNavigator = () => {
        if (!isAuthenticated) {
            return <AuthNavigator />;
        }

        if (isMobile) {
            return <MobileNavigator />;
        }
        return <DesktopNavigator />;
    };

    return <NavigationContainer>{renderNavigator()}</NavigationContainer>;
};
