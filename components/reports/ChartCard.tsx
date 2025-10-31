import React from "react";
import { useAppColors } from "../../hooks/useAppColors";
import { Box, HStack, Icon, VStack, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { ResponsiveValue } from "native-base/lib/typescript/components/types";

interface Props {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    children: React.ReactNode;
}

export default function ChartCard({ title, icon, children }: Props) {
    const { whiteColor, borderColor, secondaryColor } = useAppColors();

    return (
        <Box
            bg={whiteColor}
            p={4}
            rounded="2xl"
            shadow={2}
            borderWidth={1}
            borderColor={borderColor}
        >
            <VStack space={4}>
                <HStack alignItems="center" space={2}>
                    <Icon
                        as={Ionicons}
                        name={icon}
                        size="md"
                        color={secondaryColor}
                    />
                    <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={secondaryColor}
                    >
                        {title}
                    </Text>
                </HStack>
                <Box px={2}>{children}</Box>
            </VStack>
        </Box>
    );
}
