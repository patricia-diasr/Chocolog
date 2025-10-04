import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MobileTabParamList, RootStackParamList } from "../types/navigation";
import { TAB_CONFIG, TAB_ENTRIES, TabName } from "../configs/navigation";

import TabBar from "../components/navigation/TabBar";
import Header from "../components/navigation/Header";
import MenuScreen from "../screens/menu";
import CustomerScreen from "../screens/customer";
import OrderScreen from "../screens/order";

const Tab = createBottomTabNavigator<MobileTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MobileTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <TabBar {...props} />}
        >
            {TAB_ENTRIES.map(([name, config]) => (
                <Tab.Screen
                    key={name}
                    name={name}
                    component={config.component}
                    options={{ title: config.title }}
                />
            ))}
        </Tab.Navigator>
    );
}

interface Props {
    onLogout: () => void;
};

export default function MobileNavigator({ onLogout }: Props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={MobileTabNavigator}
                options={({ route, navigation }) => {
                    const routeName =
                        getFocusedRouteNameFromRoute(route) ?? "schedule";
                    const title =
                        TAB_CONFIG[routeName as TabName]?.title ?? "Agenda";
                    return {
                        header: () => (
                            <Header
                                title={title}
                                onMenuPress={() =>
                                    navigation.navigate("Menu", { onLogout })
                                }
                            />
                        ),
                    };
                }}
            />
            <Stack.Screen
                name="Menu"
                options={{
                    header: (props) => (
                        <Header
                            title="Menu"
                            onMenuPress={() => props.navigation.goBack()}
                            icon="arrow-back"
                        />
                    ),
                }}
            >
                {(props) => <MenuScreen {...props.route.params} />}
            </Stack.Screen>
            <Stack.Screen
                name="Customer"
                component={CustomerScreen}
                options={{
                    header: (props) => (
                        <Header
                            title="Cliente"
                            onMenuPress={() => props.navigation.goBack()}
                            icon="arrow-back"
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="Order"
                component={OrderScreen}
                options={{
                    header: (props) => (
                        <Header
                            title="Pedido"
                            onMenuPress={() => props.navigation.goBack()}
                            icon="arrow-back"
                        />
                    ),
                }}
            />
        </Stack.Navigator>
    );
}
