import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MobileTabParamList, RootStackParamList } from "../types/navigation";
import {
    SCREEN_CONFIG,
    TAB_ROUTES,
    AppScreenName,
} from "../configs/navigation";
import TabBar from "../components/navigation/TabBar";
import Header from "../components/navigation/Header";

const Tab = createBottomTabNavigator<MobileTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MobileTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <TabBar {...props} />}
        >
            {TAB_ROUTES.map(([name, config]) => (
                <Tab.Screen
                    key={name}
                    name={name as AppScreenName}
                    component={config.component}
                    options={{ title: config.title }}
                />
            ))}
        </Tab.Navigator>
    );
}

const defaultScreenOptionsWithBack: NativeStackNavigationOptions = {
    header: ({ navigation, route }) => (
        <Header
            title={
                SCREEN_CONFIG[route.name as AppScreenName]?.title || route.name
            }
            onMenuPress={() => navigation.goBack()}
            icon="arrow-back"
        />
    ),
};

interface Props {
    onLogout: () => void;
}

export default function MobileNavigator({ onLogout }: Props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={MobileTabNavigator}
                options={({ route, navigation }) => {
                    const routeName =
                        getFocusedRouteNameFromRoute(route) ?? "Schedule";
                    const title =
                        SCREEN_CONFIG[routeName as AppScreenName]?.title ??
                        "Agenda";

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

            {Object.entries(SCREEN_CONFIG).map(([name, config]) => (
                <Stack.Screen
                    key={name}
                    name={name as AppScreenName}
                    component={config.component}
                    options={defaultScreenOptionsWithBack}
                />
            ))}
        </Stack.Navigator>
    );
}
