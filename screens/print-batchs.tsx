import { useCallback, useState } from "react";
import {
    ScrollView,
    Flex,
    Box,
    VStack,
    Icon,
    Text,
    Center,
    Spinner,
} from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCustomToast } from "../contexts/ToastProvider";
import { useAppColors } from "../hooks/useAppColors";
import { getPrintBatchs } from "../services/printBatchService";
import { PrintBatch } from "../types/prints";
import FabButton from "../components/layout/FabButton";
import PrintCard from "../components/print/PrintCard";

export default function PrintBatchsScreen() {
    const { backgroundColor, mediumGreyColor, secondaryColor } = useAppColors();
    const navigation = useNavigation();
    const toast = useCustomToast();

    const [printBatchs, setPrintBatchs] = useState<PrintBatch[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isEmptyInitial = printBatchs.length === 0;

    const fetchPrintBatchs = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = (await getPrintBatchs()).sort((a, b) => b.id - a.id);
            setPrintBatchs(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os lotes de impressão. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useFocusEffect(
        useCallback(() => {
            fetchPrintBatchs();
        }, [fetchPrintBatchs]),
    );

    const handleAdd = () => {
        navigation.navigate("NewPrintBatch" as never);
    };

    if (isLoading) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando lotes...
                </Text>
            </Center>
        );
    }

    return (
        <>
            <ScrollView
                flex={1}
                bg={backgroundColor}
                showsVerticalScrollIndicator={false}
            >
                <Center>
                    <Box
                        w="100%"
                        maxW={{ md: "960px", lg: "1100px" }}
                        px={4}
                        pt={6}
                    >
                        <VStack space={4}>
                            {isEmptyInitial ? (
                                <Center py={10}>
                                    <VStack alignItems="center" space={4}>
                                        <Icon
                                            as={Ionicons}
                                            name="print"
                                            size={20}
                                            color={mediumGreyColor}
                                        />
                                        <VStack alignItems="center" space={2}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="medium"
                                                color={mediumGreyColor}
                                            >
                                                Nenhum lote de impressão
                                                registrado
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color={mediumGreyColor}
                                                textAlign="center"
                                            >
                                                Adicione lotes de impressão
                                                através da tela de cadastro
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Center>
                            ) : (
                                <Flex
                                    direction="row"
                                    wrap="wrap"
                                    justify="flex-start"
                                    mx={-2}
                                    mt={3}
                                >
                                    {printBatchs.map((print, index) => (
                                        <Box
                                            key={index}
                                            w={{
                                                base: "100%",
                                                md: "50%",
                                                lg: "33.33%",
                                            }}
                                            mb={4}
                                            px={2}
                                        >
                                            <PrintCard
                                                id={print.id}
                                                printedBy={print.printedBy}
                                                createdAt={print.createdAt}
                                                itemsCount={print.itemsCount}
                                            />
                                        </Box>
                                    ))}
                                </Flex>
                            )}
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>

            <FabButton action={handleAdd} />
        </>
    );
}
