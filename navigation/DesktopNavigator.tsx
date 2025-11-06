import React from "react";
import { View } from "react-native"; 
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../contexts/AuthContext";
import { SCREEN_CONFIG, AppScreenName } from "../configs/navigation";
import { RootDrawerParamList } from "../types/navigation";
import Header from "../components/navigation/Header";
import CustomDrawerContent from "../components/navigation/DrawerContent";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function DesktopNavigator() {
    const { userRole } = useAuth();

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
                <CustomDrawerContent {...props} />
            )}
            screenOptions={({ navigation, route }) => {
                const screenConfig = SCREEN_CONFIG[route.name as AppScreenName];
                const headerTitle = screenConfig?.title || route.name;

                return {
                    header: () => (
                        <View>
                            <Header
                                title={headerTitle}
                                onMenuPress={() => navigation.toggleDrawer()}
                            />
                        </View>
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
