import React from "react";
import { Box, Text, VStack, HStack, Divider } from "native-base";
import { StockItem } from "../../types/stock";
import LabelBadge from "../layout/LabelBadge";
import { useAppColors } from "../../hooks/useAppColors";

export default function StockCard({ flavor, sizes, status }: StockItem) {
    const {
        whiteColor,
        mediumGreyColor,
        lightGreyColor,
        darkGreyColor,
        blackColor,
        secondaryColor,
        borderColor,
    } = useAppColors();
    const totalQuantity = sizes.reduce((sum, size) => sum + size.quantity, 0);

    return (
        <Box bg={whiteColor} p={5} rounded="2xl" shadow={4}>
            <VStack space={3} mb={4}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                    <VStack flex={1}>
                        <HStack alignItems="center" space={2}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={secondaryColor}
                            >
                                {flavor}
                            </Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                            Total: {totalQuantity} un.
                        </Text>
                    </VStack>

                    <LabelBadge
                        color={status.color}
                        icon={status.icon}
                        label={status.label}
                    />
                </HStack>
                <Divider bg={lightGreyColor} />
            </VStack>

            <VStack space={3}>
                {sizes.map((sizeItem, index) => (
                    <Box>
                        <HStack
                            key={index}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <HStack space={2} alignItems="center">
                                <Text fontSize="sm" color={darkGreyColor}>
                                    {sizeItem.size}
                                </Text>
                            </HStack>
                            <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color={blackColor}
                            >
                                <Text bold>{sizeItem.quantity}</Text> un.
                            </Text>
                        </HStack>
                        {index < sizes.length - 1 && (
                            <Divider bg={lightGreyColor} />
                        )}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
