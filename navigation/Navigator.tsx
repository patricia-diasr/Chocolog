import React, { useState } from "react";
import {
    useBreakpointValue,
    Box,
    Center,
    HStack,
    Icon,
    Pressable,
    Text,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import {
    NavigationContainer,
    getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import {
    createBottomTabNavigator,
    type BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ScheduleScreen } from "../screens/schedule";
import { StockScreen } from "../screens/stock";
import { ReportsScreen } from "../screens/reports";
import { MenuScreen } from "../screens/menu";
import CustomersScreen from "../screens/customers";
import CustomerScreen from "../screens/customer";

import { Header } from "../components/layout/Header";
import LoginScreen from "../screens/login";
import { useAppColors } from "../hooks/useAppColors";

const TAB_CONFIG = {
    schedule: {
        icon: "calendar" as const,
        label: "Agenda",
        title: "Agenda",
        component: ScheduleScreen,
    },
    customers: {
        icon: "people" as const,
        label: "Clientes",
        title: "Clientes",
        component: CustomersScreen,
    },
    stock: {
        icon: "cube" as const,
        label: "Estoque",
        title: "Estoque",
        component: StockScreen,
    },
    reports: {
        icon: "print" as const,
        label: "Imprimir",
        title: "Imprimir",
        component: ReportsScreen,
    },
} as const;

type TabName = keyof typeof TAB_CONFIG;
const TAB_ENTRIES = Object.entries(TAB_CONFIG) as [
    TabName,
    (typeof TAB_CONFIG)[TabName],
][];

type RootStackParamList = {
    MainTabs: undefined;
    Menu: { onLogout: () => void };
    Customer: undefined;
    Login: { onLogin: () => void };
};

type RootDrawerParamList = {
    [K in TabName as (typeof TAB_CONFIG)[K]["title"]]: undefined;
};

interface TabBarButtonProps extends BottomTabBarProps {
    name: TabName;
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator<RootDrawerParamList>();
const CustomerStack = createNativeStackNavigator();

function CustomerStackNavigator() {
    return (
        <CustomerStack.Navigator screenOptions={{ headerShown: false }}>
            <CustomerStack.Screen
                name="CustomersList"
                component={CustomersScreen}
            />
            <CustomerStack.Screen name="Customer" component={CustomerScreen} />
        </CustomerStack.Navigator>
    );
}

function TabBarButton({ name, state, navigation }: TabBarButtonProps) {
    const isFocused = state.routes[state.index].name === name;
    const config = TAB_CONFIG[name];

    const onPress = () => {
        const event = navigation.emit({
            type: "tabPress",
            target: state.routes.find((r) => r.name === name)?.key,
            canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(name);
        }
    };

    return (
        <Pressable
            flex={1}
            onPress={onPress}
            _pressed={{ opacity: 0.7 }}
            accessibilityRole="tab"
            accessibilityLabel={config.label}
            accessibilityState={{ selected: isFocused }}
        >
            <Center
                py="2"
                px="2"
                rounded="xl"
                mx="0.5"
                bg={isFocused ? "rgba(255,255,255,0.15)" : "transparent"}
            >
                <Icon
                    as={Ionicons}
                    name={config.icon}
                    size="xl"
                    color={isFocused ? "white" : "rgba(255,255,255,0.8)"}
                    mb="1"
                />
                <Text
                    fontSize="xs"
                    color={isFocused ? "white" : "rgba(255,255,255,0.8)"}
                    textAlign="center"
                    numberOfLines={1}
                >
                    {config.label}
                </Text>
            </Center>
        </Pressable>
    );
}

function CustomTabBar(props: BottomTabBarProps) {
    const { primaryColor } = useAppColors();

    return (
        <Box
            bg={primaryColor}
            shadow={Platform.select({ ios: 8, android: 16 })}
            borderTopWidth={Platform.select({ android: 0.5 })}
            borderTopColor="rgba(255,255,255,0.1)"
            roundedTop="3xl"
        >
            <HStack
                alignItems="center"
                justifyContent="space-around"
                py="3"
                px="3"
                minH="16"
            >
                {TAB_ENTRIES.map(([name]) => (
                    <TabBarButton key={name} name={name} {...props} />
                ))}
            </HStack>
        </Box>
    );
}

function MobileTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <CustomTabBar {...props} />}
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

function MobileNavigator({ onLogout }: { onLogout: () => void }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={MobileTabNavigator}
                options={({ route, navigation }) => {
                    const routeName =
                        getFocusedRouteNameFromRoute(route) ?? "schedule";
                    const title =
                        TAB_CONFIG[routeName as TabName]?.title || "Agenda";
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
                options={({ navigation }) => ({
                    header: () => (
                        <Header
                            title="Menu"
                            onMenuPress={() => navigation.goBack()}
                            icon="arrow-back"
                        />
                    ),
                })}
            >
                {(props) => <MenuScreen {...props.route.params} />}
            </Stack.Screen>

            <Stack.Screen
                name="Customer"
                component={CustomerScreen}
                options={({ navigation }) => ({
                    header: () => (
                        <Header
                            title="Cliente"
                            onMenuPress={() => navigation.goBack()}
                            icon="arrow-back"
                        />
                    ),
                })}
            />
        </Stack.Navigator>
    );
}

function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Sair" onPress={props.onLogout} />
        </DrawerContentScrollView>
    );
}
function DesktopNavigator({ onLogout }: { onLogout: () => void }) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <CustomDrawerContent {...props} onLogout={onLogout} />
            )}
            screenOptions={({ navigation, route }) => {
                let title = route.name;

                if (route.name === TAB_CONFIG.customers.title) {
                    const focusedRoute = getFocusedRouteNameFromRoute(route);
                    if (focusedRoute === "Customer") {
                        title = "Cliente";
                    }
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
        </Drawer.Navigator>
    );
}

function AuthNavigator({ onLogin }: { onLogin: () => void }) {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={onLogin} />}
            </AuthStack.Screen>
        </AuthStack.Navigator>
    );
}

export const Navigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                isMobile ? (
                    <MobileNavigator onLogout={handleLogout} />
                ) : (
                    <DesktopNavigator onLogout={handleLogout} />
                )
            ) : (
                <AuthNavigator onLogin={handleLogin} />
            )}
        </NavigationContainer>
    );
};
