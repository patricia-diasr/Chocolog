import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../types/navigation";
import { SCREEN_CONFIG, AppScreenName } from "../configs/navigation";
import Header from "../components/navigation/Header";
import CustomDrawerContent from "../components/navigation/DrawerContent";
import { useAuth } from "../contexts/AuthContext";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function DesktopNavigator() {
    const { userRole, logout } = useAuth();

    const accessibleScreens = Object.entries(SCREEN_CONFIG).filter(
        ([name, config]) => {
            return (
                !config.adminOnly || (config.adminOnly && userRole === "ADMIN")
            );
        },
    );

    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <CustomDrawerContent {...props} onLogout={logout} />
            )}
            screenOptions={({ navigation, route }) => {
                const screenConfig = SCREEN_CONFIG[route.name as AppScreenName];
                const headerTitle = screenConfig?.title || route.name;

                return {
                    header: () => (
                        <Header
                            title={headerTitle}
                            onMenuPress={() => navigation.toggleDrawer()}
                        />
                    ),
                    drawerPosition: "left",
                };
            }}
        >
            {accessibleScreens.map(([name, config]) => (
                <Drawer.Screen
                    key={name}
                    name={name as AppScreenName}
                    component={config.component}
                    options={{
                        title: config.title,
                        drawerItemStyle: config.isMenuItem ? {} : { height: 0 },
                    }}
                />
            ))}
        </Drawer.Navigator>
    );
}
