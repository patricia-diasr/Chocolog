import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useBreakpointValue } from "native-base";
import AuthNavigator from "./AuthNavigator";
import MobileNavigator from "./MobileNavigator";
import DesktopNavigator from "./DesktopNavigator";

export const Navigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    const renderNavigator = () => {
        if (!isAuthenticated) {
            return <AuthNavigator onLogin={handleLogin} />;
        }
        if (isMobile) {
            return <MobileNavigator onLogout={handleLogout} />;
        }
        return <DesktopNavigator onLogout={handleLogout} />;
    };

    return <NavigationContainer>{renderNavigator()}</NavigationContainer>;
};
