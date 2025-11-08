import { VStack, HStack, Box, Text, Icon, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { useCustomToast } from "../../contexts/ToastProvider";
import { downloadPrintBatch } from "../../services/printBatchService";
import { formatDate } from "../../utils/formatters";
import InfoRow from "../layout/InfoRow";

interface Props {
    id: number;
    printedBy: string;
    createdAt: string;
}

export default function PrintInfoCard({
    id,
    printedBy,
    createdAt,
}: Props) {
    const { whiteColor, blackColor, tertiaryColor, borderColor } =
        useAppColors();
    const toast = useCustomToast();

    const dowload = async () => {
        toast.showToast({
            title: "Abrindo lote",
            description: "O arquivo PDF esta sendo aberto.",
            status: "info",
        });
        const pdfBlob = await downloadPrintBatch(id);

        try {
            const fileURL = URL.createObjectURL(pdfBlob);
            window.open(fileURL, "_blank");
        } catch (error) {
            toast.showToast({
                title: "Erro",
                description: "Não foi possível abrir o PDF.",
                status: "error",
            });
        }
    };

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
                            onPress={dowload}
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
                            Imprimir
                        </Button>
                    </HStack>
                    <VStack space={1.5}>
                        <InfoRow
                            iconName="calendar"
                            label="Criado em"
                            value={formatDate(createdAt)}
                        />
                        <InfoRow
                            iconName="people"
                            label="Criado por"
                            value={printedBy}
                        />
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    );
}
