import React from "react";
import { Box, VStack, Divider } from "native-base";
import { useAppColors } from "../../hooks/useAppColors";
import { Flavor } from "../../types/flavor";
import StockCardHeader from "./StockCardHeader";
import StockCardSizeItem from "./StockCardSizeItem";

export default function StockCard({ name, sizes, status }: Flavor) {
    const {
        whiteColor,
        mediumGreyColor,
        lightGreyColor,
        darkGreyColor,
    } = useAppColors();

    const totalQuantity = sizes.reduce(
        (sum, size) => sum + size.totalQuantity,
        0,
    );

    const totalRemainingQuantity = sizes.reduce(
        (sum, size) => sum + size.remainingQuantity,
        0,
    );

    return (
        <Box bg={whiteColor} p={4} rounded="xl" shadow={2}>
            <StockCardHeader
                name={name}
                status={status}
                totalQuantity={totalQuantity}
                totalRemainingQuantity={totalRemainingQuantity}
            />
            <Divider bg={lightGreyColor} />
            <VStack space={3} mt={4}>
                {sizes.map((sizeItem, index) => (
                    <StockCardSizeItem
                        key={sizeItem.name}
                        sizeItem={sizeItem}
                        isLastItem={index === sizes.length - 1}
                        mediumGreyColor={mediumGreyColor}
                        darkGreyColor={darkGreyColor}
                        lightGreyColor={lightGreyColor}
                    />
                ))}
            </VStack>
        </Box>
    );
}
