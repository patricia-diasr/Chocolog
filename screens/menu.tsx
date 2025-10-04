import React from "react";
import { VStack, ScrollView, Box, Center } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MENU_ITEMS } from "../configs/navigation";
import { RootDrawerParamList } from "../types/navigation";
import ItemNavigation from "../components/navigation/ItemNavigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppColors } from "../hooks/useAppColors";

type MenuScreenNavigation = StackNavigationProp<RootDrawerParamList>;

interface Props {
    onLogout: () => void;
}

export default function MenuScreen({ onLogout }: Props) {
    const { backgroundColor } = useAppColors();
    const navigation = useNavigation<MenuScreenNavigation>();

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
                        {MENU_ITEMS.map((item) => (
                            <ItemNavigation
                                key={item.name}
                                {...item}
                                route={item.route as keyof RootDrawerParamList}
                                navigation={navigation}
                            />
                        ))}

                        <ItemNavigation
                            name="Sair"
                            subtitle="Realize logout"
                            icon="log-out"
                            onPress={onLogout}
                        />
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    );
}
