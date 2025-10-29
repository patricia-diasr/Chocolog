import { useCallback, useEffect, useMemo, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Box, Center, ScrollView, Spinner, VStack, Text } from "native-base";

import InfoList from "../components/layout/InfoList";
import { useAppColors } from "../hooks/useAppColors";
import { getStatusDetails } from "../utils/statusConfig";
import {
    formatDate,
    formatOrderDetailTitleWithNotes,
} from "../utils/formatters";
import { PrintBatchDetail } from "../types/prints";
import PrintInfoCard from "../components/print/PrintInfoCard";
import { RootStackParamList } from "../types/navigation";
import { getPrintBatch } from "../services/printBatchService";
import { useCustomToast } from "../contexts/ToastProvider";

type PrintBatchScreenRouteProp = RouteProp<RootStackParamList, "PrintBatch">;

type Props = {
    route: PrintBatchScreenRouteProp;
};

export default function PrintBatchScreen({ route }: Props) {
    const { backgroundColor, secondaryColor, mediumGreyColor } = useAppColors();
    const { printBatchId } = route.params;

    const navigation = useNavigation();
    const toast = useCustomToast();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [printBatchData, setPrintBatchData] = useState<PrintBatchDetail>();

    const fetchPrintBatch = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await getPrintBatch(printBatchId);
            setPrintBatchData(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar o lote de impressão. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast, printBatchId]); 

    useEffect(() => {
        fetchPrintBatch();
    }, [fetchPrintBatch]);

    const printItems = useMemo(() => {
        if (!printBatchData) {
            return [];
        }

        const groupedByOrderId = printBatchData.items.reduce((acc, item) => {
            const key = item.orderItem.orderId;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {} as Record<string, typeof printBatchData.items>);

        return Object.values(groupedByOrderId).map((group) => {
            const firstItem = group[0];
            const status = getStatusDetails(firstItem.orderItem.status);

            const combinedInfo = group
                .map((item) => formatOrderDetailTitleWithNotes(item.orderItem))
                .join("\n");

            return {
                id: firstItem.id,
                title: firstItem.orderItem.customerName,
                info: combinedInfo,
                aditionalInfo: formatDate(
                    firstItem.orderItem.expectedPickupDate || "",
                ),
                badgeColor: status.colorScheme,
                badgeIcon: status.icon,
                badgeLabel: status.label,
            };
        });
    }, [printBatchData]);

    const handleNavigateToOrder = (orderItemId: number) => {
        const item = printBatchData!.items.find(
            (oi) => oi.id === orderItemId,
        );
        const customerId = item?.orderItem.customerId;
        const orderId = item?.orderItem.orderId;

        if (customerId) {
            navigation.navigate("Order", {
                customerId: customerId,
                orderId: orderId,
            });
        }
    };

    if (isLoading || !printBatchData) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando lote de impressão...
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
                            <PrintInfoCard
                                id={printBatchData.id}
                                printedBy={printBatchData.printedBy.name}
                                createdAt={printBatchData.createdAt}
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