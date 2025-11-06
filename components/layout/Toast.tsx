import React from "react";
import { Box, Text, HStack, Icon, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";

export type ToastStatus = "success" | "warning" | "error" | "info";

interface Props {
    title: string;
    description?: string;
    status: ToastStatus;
}

const config: Record<
    ToastStatus,
    { bgColor: string; accentColor: string; icon: string }
> = {
    success: {
        bgColor: "green.50",
        accentColor: "green.600",
        icon: "checkmark-circle",
    },
    warning: {
        bgColor: "orange.50",
        accentColor: "orange.600",
        icon: "warning",
    },
    error: {
        bgColor: "red.50",
        accentColor: "red.600",
        icon: "close-circle",
    },
    info: {
        bgColor: "blue.50",
        accentColor: "blue.600",
        icon: "information-circle",
    },
};

export default function Toast({ title, description, status }: Props) {
    const { mediumGreyColor, blackColor } = useAppColors();
    const toastConfig = config[status];

    return (
        <Box
            zIndex={99999}
            bg={toastConfig.bgColor}
            px={4}
            py={3}
            rounded="lg"
            shadow={3}
            maxWidth="350px"
            w="95%"
            alignSelf="center"
            borderLeftWidth={5}
            borderLeftColor={toastConfig.accentColor}
            marginTop={2}
        >
            <HStack alignItems="center" space={3}>
                <Icon
                    as={Ionicons}
                    name={toastConfig.icon as any}
                    color={toastConfig.accentColor}
                    size={6}
                />
                <VStack flex={1}>
                    <Text bold color={blackColor} fontSize="md">
                        {title}
                    </Text>
                    {description && (
                        <Text color={mediumGreyColor} fontSize="sm">
                            {description}
                        </Text>
                    )}
                </VStack>
            </HStack>
        </Box>
    );
}
