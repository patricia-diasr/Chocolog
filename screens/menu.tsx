import React, { useMemo } from "react";
import { VStack, ScrollView, Box, Center } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppColors } from "../hooks/useAppColors";
import { useAuth } from "../contexts/AuthContext";
import {
    MENU_ITEMS,
    SCREEN_CONFIG,
    AppScreenName,
} from "../configs/navigation";
import { RootStackParamList } from "../types/navigation";
import ItemNavigation from "../components/navigation/ItemNavigation";

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MenuScreen() {
    const { backgroundColor } = useAppColors();
    const { logout, userRole } = useAuth();
    const navigation = useNavigation<MenuScreenNavigationProp>();

    const accessibleMenuItems = useMemo(() => {
        return MENU_ITEMS.filter((item) => {
            const config = SCREEN_CONFIG[item.route];
            if (!config) return false;

            return (
                !config.adminOnly || (config.adminOnly && userRole === "ADMIN")
            );
        });
    }, [userRole]);
    
    const handleNavigation = (routeTarget: AppScreenName) => {
        const screenConfig = SCREEN_CONFIG[routeTarget];
        if (!screenConfig) return;

        if (screenConfig.isTab) {
            navigation.navigate("MainTabs", { screen: routeTarget });
        } else {
            navigation.navigate(routeTarget);
        }
    };

    return (
        <ScrollView
            flex={1}
            bg={backgroundColor}
            showsVerticalScrollIndicator={false}
        >
            <Center>
                <Box
                    w="100%"
                    maxW={{ md: "960px", lg: "1100px" }}
                    px={4}
                    pt={6}
                >
                    <VStack space={4}>
                        {accessibleMenuItems.map((item) => {
                            return (
                                <ItemNavigation
                                    key={item.name}
                                    name={item.name}
                                    subtitle={item.subtitle}
                                    icon={item.icon}
                                    onPress={() => handleNavigation(item.route)}
                                />
                            );
                        })}

                        <ItemNavigation
                            name="Sair"
                            subtitle="Realize logout"
                            icon="log-out"
                            onPress={logout}
                        />
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    );
}
