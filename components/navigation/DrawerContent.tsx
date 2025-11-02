import React, { useMemo } from "react";
import { VStack } from "native-base";
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MENU_ITEMS, SCREEN_CONFIG } from "../../configs/navigation";
import { RootDrawerParamList } from "../../types/navigation";
import ItemNavigation from "./ItemNavigation";
import { useAuth } from "../../contexts/AuthContext";

type Props = DrawerContentComponentProps;

export default function DrawerContent(props: Props) {
    const { logout, userRole } = useAuth();

    const accessibleMenuItems = useMemo(() => {
        return MENU_ITEMS.filter((item) => {
            const config = SCREEN_CONFIG[item.route];
            if (!config) return false;
            return (
                !config.adminOnly || (config.adminOnly && userRole === "ADMIN")
            );
        });
    }, [userRole]);

    return (
        <DrawerContentScrollView
            {...props}
            style={{ backgroundColor: "#1f8f8f", paddingHorizontal: 6 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack space={4} my={4} mx={2}>
                {accessibleMenuItems.map((item) => (
                    <ItemNavigation
                        key={item.name}
                        name={item.name}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        onPress={() =>
                            props.navigation.navigate(
                                item.route as keyof RootDrawerParamList,
                            )
                        }
                    />
                ))}
                <ItemNavigation
                    name="Sair"
                    subtitle="Realize logout"
                    icon="log-out"
                    onPress={logout}
                />
            </VStack>
        </DrawerContentScrollView>
    );
}
