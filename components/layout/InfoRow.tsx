import React, { ComponentProps } from "react";
import {
    HStack,
    Text,
    Icon,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    iconName: ComponentProps<typeof Ionicons>["name"];
    label: string;
    value: string | number;
}

export default function InfoRow({ iconName, label, value }: Props) {
    const { darkGreyColor } = useAppColors();

    return (
        <HStack alignItems="center" space={2.5}>
            <Icon
                as={Ionicons}
                name={iconName}
                size="sm"
                opacity={75}
                color={darkGreyColor}
            />
            <Text fontSize="md">
                <Text fontWeight="medium" color={darkGreyColor}>
                    {label}:
                </Text>
                <Text color={darkGreyColor}> {value}</Text>
            </Text>
        </HStack>
    );
}
