import { Box, Divider, HStack, Icon, Text, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { formatDate } from "../../utils/formatters";
import { StockRecord } from "../../types/stock";
import LabelBadge from "../layout/LabelBadge";

interface Props {
    date: string;
    records: StockRecord[];
};

export default function RecordCard({ date, records }: Props) {
    const {
        whiteColor,
        lightGreyColor,
        mediumGreyColor,
        secondaryColor,
        borderColor,
    } = useAppColors();

    const dayOfWeek = new Date(date).toLocaleDateString("pt-BR", {
        weekday: "long",
    });

    const totalEntries = records
        .filter((r) => r.movementType === "INBOUND")
        .reduce((sum, r) => sum + r.quantity, 0);
    const totalExits = records
        .filter((r) => r.movementType === "OUTBOUND")
        .reduce((sum, r) => sum + r.quantity, 0);

    return (
        <Box
            bg={whiteColor}
            p={5}
            rounded="2xl"
            shadow={4}
            borderWidth={1}
            borderColor={borderColor}
            mx={1}
        >
            <VStack space={3} mb={4}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                    <VStack flex={1}>
                        <HStack alignItems="center" space={2}>
                            <Icon
                                as={Ionicons}
                                name="calendar"
                                size="sm"
                                color={secondaryColor}
                            />
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={secondaryColor}
                            >
                                {formatDate(date)}
                            </Text>
                        </HStack>
                        <Text
                            fontSize="sm"
                            color={mediumGreyColor}
                            textTransform="capitalize"
                        >
                            {dayOfWeek}
                        </Text>
                    </VStack>

                    <VStack alignItems="flex-end" space={1}>
                        <HStack space={2}>
                            {totalEntries > 0 && (
                                <LabelBadge
                                    color="success"
                                    icon="arrow-up"
                                    label={totalEntries.toString()}
                                />
                            )}
                            {totalExits > 0 && (
                                <LabelBadge
                                    color="danger"
                                    icon="arrow-down"
                                    label={totalExits.toString()}
                                />
                            )}
                        </HStack>
                    </VStack>
                </HStack>

                <Divider bg={lightGreyColor} />
            </VStack>

            <VStack space={3}>
                {records.map((record, index) => (
                    <Box key={index}>
                        <HStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <HStack space={2} alignItems="center">
                                <Box
                                    bg={
                                        record.movementType === "INBOUND"
                                            ? "green.100"
                                            : "red.100"
                                    }
                                    rounded="full"
                                    p={1}
                                >
                                    <Icon
                                        as={Ionicons}
                                        name={
                                            record.movementType === "INBOUND"
                                                ? "add"
                                                : "remove"
                                        }
                                        color={
                                            record.movementType === "INBOUND"
                                                ? "green.600"
                                                : "red.600"
                                        }
                                        size="xs"
                                    />
                                </Box>
                                <Text fontSize="sm" color="gray.700">
                                    <Text bold>{record.quantity}x</Text>{" "}
                                    {record.flavorName} ({record.sizeName})
                                </Text>
                            </HStack>
                        </HStack>
                        {index < records.length - 1 && (
                            <Divider my={2} bg={lightGreyColor} />
                        )}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
