import { Box, VStack, Text, HStack } from "native-base";
import { StockStatus } from "../../types/stock";
import { useAppColors } from "../../hooks/useAppColors";
import LabelBadge from "../layout/LabelBadge";

interface Props {
    name: string;
    status: StockStatus;
    totalRemainingQuantity: number;
}

export default function StockCardHeader({
    name,
    status,
    totalRemainingQuantity,
}: Props) {
    const { secondaryColor, mediumGreyColor, darkGreyColor } = useAppColors();

    return (
        <VStack space={3} mb={4}>
            <HStack justifyContent="space-between" alignItems="flex-start">
                <VStack flex={1} space={1}>
                    <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={secondaryColor}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {name}
                    </Text>
                    <HStack space={4} alignItems="center" flexWrap="wrap">
                        <HStack space={1} alignItems="baseline">
                            <Text fontSize="xs" color={mediumGreyColor}>
                                Disponível:
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color={darkGreyColor}
                            >
                                {totalRemainingQuantity}
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
                <Box ml={2}>
                    <LabelBadge
                        color={status.color}
                        icon={status.icon}
                        label={status.label}
                    />
                </Box>
            </HStack>
        </VStack>
    );
}
