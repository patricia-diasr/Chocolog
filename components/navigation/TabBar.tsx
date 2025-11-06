import React from "react";
import { Box, Center, HStack, Icon, Pressable, Text } from "native-base";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAppColors } from "../../hooks/useAppColors";
import { SCREEN_CONFIG, AppScreenName } from "../../configs/navigation";

interface TabBarButtonProps {
    route: { key: string; name: string };
    isFocused: boolean;
    navigation: BottomTabBarProps["navigation"];
}

function TabBarButton({ route, isFocused, navigation }: TabBarButtonProps) {
    const config = SCREEN_CONFIG[route.name as AppScreenName];
    if (!config || !config.isTab) {
        return null;
    }
    
    const color = isFocused ? "white" : "rgba(255,255,255,0.8)";
    
    const onPress = () => {
        const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    };


    return (
        <Pressable
            flex={1}
            onPress={onPress}
            _pressed={{ opacity: 0.7 }}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={config.title}
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
                    name={config.icon || "ellipse"}
                    size="xl"
                    color={color}
                    mb="1"
                />
                <Text
                    fontSize="xs"
                    color={color}
                    textAlign="center"
                    numberOfLines={1}
                >
                    {config.title}
                </Text>
            </Center>
        </Pressable>
    );
}

export default function TabBar({ state, navigation }: BottomTabBarProps) {
    const { primaryColor } = useAppColors();

    return (
        <Box
            bg={primaryColor}
            shadow={Platform.OS === "ios" ? 8 : 16}
            borderTopWidth={Platform.OS === "android" ? 0.5 : 0}
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
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    return (
                        <TabBarButton
                            key={route.key}
                            route={route}
                            isFocused={isFocused}
                            navigation={navigation}
                        />
                    );
                })}
            </HStack>
        </Box>
    );
}
