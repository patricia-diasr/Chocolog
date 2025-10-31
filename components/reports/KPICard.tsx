import React from "react";
import { useAppColors } from "../../hooks/useAppColors";
import { Box, HStack, Icon, VStack, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    title: string;
    subtitle: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export default function KPICard({ title, subtitle, value, icon }: Props) {
    const {
        whiteColor,
        borderColor,
        blackColor,
        mediumGreyColor,
        secondaryColor,
    } = useAppColors();

    return (
        <Box
            bg={whiteColor}
            p={4}
            rounded="2xl"
            shadow={2}
            borderWidth={1}
            borderColor={borderColor}
            w={{
                base: "100%",
                md: "250px",
                lg: "255px"
            }}
            marginBottom={4}
        >
            <VStack space={4}>
                <HStack alignItems="center" space={2}>
                    <Icon
                        as={Ionicons}
                        name={icon as any}
                        size="sm"
                        color={secondaryColor}
                    />
                    <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={secondaryColor}
                    >
                        {title}
                    </Text>
                </HStack>
                <HStack flex={1}>
                    <VStack alignItems="center" flex={1}>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={blackColor}
                        >
                            {value}
                        </Text>
                        <Text
                            fontSize="xs"
                            color={mediumGreyColor}
                            textAlign="center"
                        >
                            {subtitle}
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
}