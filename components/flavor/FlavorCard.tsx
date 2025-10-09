import { Box, VStack, HStack, Text, IconButton, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import type { Flavor } from "../../types/flavor";
import { formatPrice } from "../../utils/formatters";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    flavor: Flavor;
    onEdit: () => void;
    onDelete: () => void;
}

export default function FlavorCard({ flavor, onEdit, onDelete }: Props) {
    const { whiteColor, mediumGreyColor, secondaryColor, borderColor } =
        useAppColors();

    return (
        <Box
            bg={whiteColor}
            borderRadius="xl"
            shadow="2"
            borderWidth={1}
            borderColor={borderColor}
            overflow="hidden"
        >
            <HStack
                bg={borderColor}
                p={4}
                alignItems="center"
                justifyContent="space-between"
            >
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={secondaryColor}
                    flex={1}
                >
                    {flavor.flavor}
                </Text>
                <HStack>
                    <IconButton
                        icon={<Icon as={Ionicons} name="create-outline" />}
                        onPress={onEdit}
                        colorScheme="blue"
                        variant="ghost"
                    />
                    <IconButton
                        icon={<Icon as={Ionicons} name="trash-outline" />}
                        onPress={onDelete}
                        colorScheme="red"
                        variant="ghost"
                    />
                </HStack>
            </HStack>
            <VStack p={4} space={3}>
                <HStack justifyContent="space-around">
                    {flavor.prices.slice(0, 2).map((price) => (
                        <VStack key={price.size} alignItems="center" flex={1}>
                            <Text
                                fontSize="sm"
                                color={secondaryColor}
                                fontWeight="bold"
                                lineHeight="sm"
                            >
                                {price.size}
                            </Text>
                            <Text
                                fontSize="md"
                                fontWeight="bolder"
                                lineHeight="lg"
                            >
                                {formatPrice(price.sale_price)}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={mediumGreyColor}
                                fontWeight="medium"
                                lineHeight="md"
                            >
                                Custo {formatPrice(price.cost_price)}
                            </Text>
                        </VStack>
                    ))}
                </HStack>
                <HStack justifyContent="space-around">
                    {flavor.prices.slice(2, 4).map((price) => (
                        <VStack key={price.size} alignItems="center" flex={1}>
                            <Text
                                fontSize="sm"
                                color={secondaryColor}
                                fontWeight="bold"
                                lineHeight="sm"
                            >
                                {price.size}
                            </Text>
                            <Text
                                fontSize="md"
                                fontWeight="bolder"
                                lineHeight="lg"
                            >
                                {formatPrice(price.sale_price)}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={mediumGreyColor}
                                fontWeight="medium"
                                lineHeight="md"
                            >
                                Custo {formatPrice(price.cost_price)}
                            </Text>
                        </VStack>
                    ))}
                </HStack>
            </VStack>
        </Box>
    );
}
