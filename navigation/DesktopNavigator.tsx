import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { RootDrawerParamList } from "../types/navigation";
import { TAB_ENTRIES } from "../configs/navigation";

import Header from "../components/navigation/Header";
import CustomDrawerContent from "../components/navigation/DrawerContent";
import CustomerStackNavigator from "./CustomerStack";

import { FlavorListScreen } from "../screens/flavor-list";
import { EmployeesScreen } from "../screens/employees";
import OrderScreen from "../screens/order";

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
                const focusedRoute = getFocusedRouteNameFromRoute(route);
                let title = route.name;

                if (route.name === "Clientes" && focusedRoute === "Customer") {
                    title = "Cliente";
                }

                if (route.name === "Order") {
                    title = "Pedido"
                }

                return {
                    header: () => (
                        <Header
                            title={title}
                            onMenuPress={() => navigation.toggleDrawer()}
                        />
                    ),
                    drawerPosition: "left",
                };
            }}
        >
            {TAB_ENTRIES.map(([name, config]) => {
                if (name === "customers") {
                    return (
                        <Drawer.Screen
                            key={name}
                            name={config.title}
                            component={CustomerStackNavigator}
                        />
                    );
                }
                return (
                    <Drawer.Screen
                        key={name}
                        name={config.title}
                        component={config.component}
                    />
                );
            })}
            <Drawer.Screen
                name="Sabores"
                component={FlavorListScreen}
                options={{ title: "Gerenciar Sabores" }}
            />
            <Drawer.Screen
                name="Funcionarios"
                component={EmployeesScreen}
                options={{ title: "Funcionários" }}
            />
            <Drawer.Screen
                name="Order"
                component={OrderScreen}
                options={{ title: "Pedido", drawerItemStyle: { height: 0 } }}
            />
        </Drawer.Navigator>
    );
}
