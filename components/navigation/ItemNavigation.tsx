import React from "react";
import { Center, HStack, Icon, Pressable, Text, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { RootDrawerParamList } from "../../types/navigation";
import { NavigationProp } from "@react-navigation/native";

interface Props {
    name: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    route?: keyof RootDrawerParamList;
    onPress?: () => void;
    navigation?: NavigationProp<RootDrawerParamList>;
}

export default function ItemNavigation({
    name,
    subtitle,
    icon,
    route,
    onPress,
    navigation,
}: Props) {
    const { secondaryColor, whiteColor, darkGreyColor, borderColor } =
        useAppColors();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (route && navigation) {
            navigation.navigate(route);
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            bg={whiteColor}
            borderRadius="xl"
            p={3}
            _hover={{ bg: borderColor }}
            _pressed={{ bg: borderColor }}
        >
            <HStack alignItems="center" space={4}>
                <Center bg="primary.500" p={3} borderRadius="full">
                    <Icon as={Ionicons} name={icon} color="white" size="md" />
                </Center>
                <VStack flex={1}>
                    <Text fontSize="md" bold color={secondaryColor}>
                        {name}
                    </Text>
                    <Text fontSize="xs" color={darkGreyColor}>
                        {subtitle}
                    </Text>
                </VStack>
                <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    color={darkGreyColor}
                    size="md"
                />
            </HStack>
        </Pressable>
    );
}
