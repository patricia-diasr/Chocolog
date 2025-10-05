import React from "react";
import { VStack } from "native-base";
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MENU_ITEMS } from "../../configs/navigation";
import { RootDrawerParamList } from "../../types/navigation";
import ItemNavigation from "./ItemNavigation";

type Props = DrawerContentComponentProps & {
    onLogout: () => void;
};

export default function DrawerContent(props: Props) {
    return (
        <DrawerContentScrollView
            {...props}
            style={{ backgroundColor: "#1f8f8f", paddingHorizontal: 6 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack space={4} my={4} mx={2}>
                {MENU_ITEMS.map((item) => (
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
                    onPress={props.onLogout}
                />
            </VStack>
        </DrawerContentScrollView>
    );
}
