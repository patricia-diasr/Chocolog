import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../types/navigation";
import { SCREEN_CONFIG, AppScreenName } from "../configs/navigation";
import Header from "../components/navigation/Header";
import CustomDrawerContent from "../components/navigation/DrawerContent";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

type DesktopNavigatorProps = {
    onLogout: () => void;
};

export default function DesktopNavigator({ onLogout }: DesktopNavigatorProps) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <CustomDrawerContent {...props} onLogout={onLogout} />
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
            {Object.entries(SCREEN_CONFIG).map(([name, config]) => (
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
