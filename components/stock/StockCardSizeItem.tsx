import { Box, Text, HStack, Divider } from "native-base";
import { useAppColors } from "../../hooks/useAppColors";
import { FlavorSize } from "../../types/flavor";

interface Props {
    sizeItem: FlavorSize;
    isLastItem: boolean;
}

export default function RecordFormModal({ sizeItem, isLastItem }: Props) {
    const { lightGreyColor, mediumGreyColor, darkGreyColor, blackColor } =
        useAppColors();

    return (
        <Box>
            <HStack
                justifyContent="space-between"
                alignItems="center"
                space={2}
            >
                <Text
                    fontSize="sm"
                    color={blackColor}
                    fontWeight="bold"
                    flex={1}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {sizeItem.name}
                </Text>

                <HStack space={8} alignItems="center">
                    <HStack w="75px" space={1} alignItems="baseline">
                        <Text fontSize="xs" color={mediumGreyColor}>
                            Disp:
                        </Text>
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={darkGreyColor}
                            flex={1}
                            textAlign="right"
                        >
                            {sizeItem.remainingQuantity}
                        </Text>
                    </HStack>

                    <HStack w="75px" space={1} alignItems="baseline">
                        <Text fontSize="xs" color={mediumGreyColor}>
                            Total:
                        </Text>
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={darkGreyColor}
                            flex={1}
                            textAlign="right"
                        >
                            {sizeItem.totalQuantity}
                        </Text>
                    </HStack>
                </HStack>
            </HStack>

            {!isLastItem && <Divider bg={lightGreyColor} mt={3} />}
        </Box>
    );
}
