import { useState } from "react";
import { ScrollView, Flex, Box, VStack, Icon, Text, Center } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FabButton from "../components/layout/FabButton";
import PrintCard from "../components/print/PrintCard";
import { PrintBatch } from "../types/prints";
import { useAppColors } from "../hooks/useAppColors";

const printBatchesMock: PrintBatch[] = [
    {
        id: "1",
        printed_by_employee: "Maria Silva",
        created_at: "2025-02-03",
        items: [
            {
                id: "1",
                order_id: "1",
                status: "pending",
                due_date: "2025-03-10",
                order_detail: {
                    id: "1",
                    size: "500g",
                    flavor1: "Sensação",
                    flavor2: "Prestígio",
                    quantity: 2,
                    unit_price: 60,
                    total_price: 120,
                    notes: "Embalagem rosa",
                    status: "pending",
                    custom_made: true,
                },
                customer: {
                    id: "4",
                    name: "Pedro Oliveira",
                    phone: "11666666666",
                    isReseller: false,
                },
            },
        ],
    },
    {
        id: "2",
        printed_by_employee: "João Pereira",
        created_at: "2025-02-04",
        items: [
            {
                id: "2",
                order_id: "2",
                status: "pending",
                due_date: "2025-03-12",
                order_detail: {
                    id: "2",
                    size: "1Kg",
                    flavor1: "Brigadeiro",
                    quantity: 1,
                    unit_price: 95,
                    total_price: 95,
                    status: "pending",
                    custom_made: false,
                },
                customer: {
                    id: "5",
                    name: "Ana Costa",
                    phone: "19888888888",
                    isReseller: true,
                },
            },
            {
                id: "3",
                order_id: "3",
                status: "completed",
                due_date: "2025-03-15",
                order_detail: {
                    id: "3",
                    size: "Coração",
                    flavor1: "Ninho",
                    flavor2: "Maracujá",
                    quantity: 5,
                    unit_price: 35,
                    total_price: 175,
                    status: "completed",
                    custom_made: false,
                },
                customer: {
                    id: "6",
                    name: "Carlos Souza",
                    phone: "21777777777",
                    isReseller: false,
                },
            },
        ],
    },
    {
        id: "3",
        printed_by_employee: "Fernanda Lima",
        created_at: "2025-02-05",
        items: [
            {
                id: "4",
                order_id: "4",
                status: "pending",
                due_date: "2025-03-20",
                order_detail: {
                    id: "4",
                    size: "500g",
                    flavor1: "Maracujá",
                    flavor2: "Branco Liso",
                    quantity: 1,
                    unit_price: 65,
                    total_price: 65,
                    status: "pending",
                    custom_made: true,
                },
                customer: {
                    id: "5",
                    name: "Ana Costa",
                    phone: "19888888888",
                    isReseller: true,
                },
            },
        ],
    },
];

export default function PrintBatchesScreen() {
    const { backgroundColor, mediumGreyColor } = useAppColors();
    const navigation = useNavigation();

    const [printBatches, setPrintBatches] =
        useState<PrintBatch[]>(printBatchesMock);
    const isEmptyInitial = printBatches.length === 0;

    const handleAdd = () => {
        navigation.navigate("NewPrintBatch" as never);
    };

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
                                    {printBatches.map((print, index) => (
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
                                                printed_by_employee={
                                                    print.printed_by_employee
                                                }
                                                created_at={print.created_at}
                                                items={print.items}
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
