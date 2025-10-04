import React from "react";
import { Center, HStack, Text, Pressable, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
    title: string;
    onMenuPress: () => void;
    icon?: string;
};

export const Header = ({
    title,
    onMenuPress,
    icon = "menu",
}: Props) => {
    const { primaryColor, whiteColor } = useAppColors();
    const insets = useSafeAreaInsets();

    return (
        <Center
            bg={primaryColor}
            pt={`${insets.top}px`}
            shadow={Platform.select({ ios: 2, android: 4 })}
        >
            <HStack
                alignItems="center"
                justifyContent="space-between"
                py={2}
                w="100%"
                maxW={{ md: "960px", lg: "1250px" }}
                px={4}
                minH="12"
            >
                <Text
                    fontFamily="BerkshireSwash_400Regular"
                    fontSize="2xl"
                    color={whiteColor}
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
                    <Icon
                        as={Ionicons}
                        name={icon}
                        size="xl"
                        color={whiteColor}
                    />
                </Pressable>
            </HStack>
        </Center>
    );
};
