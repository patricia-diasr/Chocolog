import React from "react";
import { Box, Center, HStack, Icon, Pressable, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAppColors } from "../../hooks/useAppColors";
import { TAB_CONFIG, TAB_ENTRIES, TabName } from "../../configs/navigation";

function TabBarButton({
    name,
    state,
    navigation,
}: { name: TabName } & BottomTabBarProps) {
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

export default function TabBar(props: BottomTabBarProps) {
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
                {TAB_ENTRIES.map(([name]) => (
                    <TabBarButton key={name} name={name} {...props} />
                ))}
            </HStack>
        </Box>
    );
}
