import { VStack, HStack, Box, Text, Icon, Button } from "native-base";
import InfoRow from "../layout/InfoRow";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../utils/formatters";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    id: string;
    printed_by_employee: string;
    created_at: string;
}

export default function PrintInfoCard({
    id,
    printed_by_employee,
    created_at,
}: Props) {
    const { whiteColor, blackColor, tertiaryColor, borderColor } =
        useAppColors();

    const dowloadPrintBatch = () => {};

    return (
        <Box
            bg={whiteColor}
            p={4}
            rounded="2xl"
            shadow={2}
            borderWidth={1}
            borderColor={borderColor}
        >
            <VStack space={3}>
                <VStack space={1.5}>
                    <HStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <HStack alignItems="center" space={2}>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={blackColor}
                            >
                                Impressão #{id}
                            </Text>
                        </HStack>
                        <Button
                            onPress={dowloadPrintBatch}
                            size="xs"
                            colorScheme="secondary"
                            rounded="xl"
                            _pressed={{ bg: tertiaryColor }}
                            _hover={{ bg: tertiaryColor }}
                            py={2}
                            shadow={2}
                            _text={{
                                fontSize: "xs",
                                fontWeight: "medium",
                            }}
                            leftIcon={
                                <Icon
                                    as={Ionicons}
                                    name="print"
                                    color={whiteColor}
                                    size="xs"
                                />
                            }
                        >
                            Baixar
                        </Button>
                    </HStack>
                    <VStack space={1.5}>
                        <InfoRow
                            iconName="calendar"
                            label="Criado em"
                            value={formatDate(created_at)}
                        />
                        <InfoRow
                            iconName="people"
                            label="Criado por"
                            value={printed_by_employee}
                        />
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    );
}
