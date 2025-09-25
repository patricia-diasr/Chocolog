import React from "react";
import { Box, HStack, Text, Pressable, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import type { IoniconsGlyph } from "@expo/vector-icons/build/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

type Props = {
    title: string;
    onMenuPress: () => void;
    icon?: keyof IoniconsGlyph; 
};

export const Header = ({
    title,
    onMenuPress,
    icon = "menu-outline",
}: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <Box
            bg="primary.600"
            pt={`${insets.top}px`}
            shadow={Platform.select({ ios: 2, android: 4 })}
        >
            <HStack
                alignItems="center"
                justifyContent="space-between"
                px={4}
                py={2}
                minH="12"
            >
                <Text
                    fontFamily="BerkshireSwash"
                    fontSize="xl"
                    fontWeight="bold"
                    color="white"
                    numberOfLines={1}
                    flex={1}
                >
                    {title}
                </Text>

                <Pressable
                    _pressed={{ opacity: 0.7 }}
                    onPress={onMenuPress}
                    p="2"
                    rounded="full"
                    _hover={{ bg: "rgba(255,255,255,0.1)" }}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel="Acessar menu"
                >
                    <Icon as={Ionicons} name={icon} size="lg" color="white" />
                </Pressable>
            </HStack>
        </Box>
    );
};
