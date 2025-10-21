import { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, Center, ScrollView, VStack } from "native-base";

import InfoList from "../components/layout/InfoList";
import { useAppColors } from "../hooks/useAppColors";
import { getStatusDetails } from "../utils/statusConfig";
import {
    formatDate,
    formatOrderDetailTitleWithNotes,
} from "../utils/formatters";
import { PrintBatch } from "../types/prints";
import PrintInfoCard from "../components/print/PrintInfoCard";

const printBatchMock: PrintBatch = {
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
            status: "pending",
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
        {
            id: "3",
            order_id: "2",
            status: "completed",
            due_date: "2025-03-12",
            order_detail: {
                id: "3",
                size: "500g",
                flavor1: "Prestígio",
                quantity: 1,
                unit_price: 95,
                total_price: 95,
                notes: "Embalagem rosa",
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
    ],
};

export default function PrintBatchScreen() {
    const { backgroundColor } = useAppColors();
    const navigation = useNavigation();

    const [printBatchData, setPrintBatchData] =
        useState<PrintBatch>(printBatchMock);

    const handleNavigateToOrder = () => {
        navigation.navigate("Order" as never);
    };

    const printItems = useMemo(() => {
        const groupedByOrderId = printBatchData.items.reduce((acc, item) => {
            const key = item.order_id;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {} as Record<string, typeof printBatchData.items>);

        return Object.values(groupedByOrderId).map((group) => {
            const firstItem = group[0];
            const status = getStatusDetails(firstItem.order_detail.status);

            const combinedInfo = group
                .map((item) =>
                    formatOrderDetailTitleWithNotes(item.order_detail),
                )
                .join("\n");

            return {
                id: firstItem.order_id,
                title: firstItem.customer.name,
                info: combinedInfo,
                aditionalInfo: formatDate(firstItem.due_date),
                badgeColor: status.colorScheme,
                badgeIcon: status.icon,
                badgeLabel: status.label,
            };
        });
    }, [printBatchData]);

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
                            <PrintInfoCard
                                id={printBatchData.id}
                                printed_by_employee={
                                    printBatchData.printed_by_employee
                                }
                                created_at={printBatchData.created_at}
                            />
                            <InfoList
                                title={`Itens do Lote`}
                                icon="cube"
                                items={printItems}
                                emptyStateText="Nenhum item encontrado."
                                onItemPress={handleNavigateToOrder}
                            />
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
        </>
    );
}
