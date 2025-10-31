import React, { useCallback, useEffect, useState } from "react";
import { Box, Center, Text, ScrollView, Spinner, VStack } from "native-base";
import { ReportData } from "../types/reports";
import { useAppColors } from "../hooks/useAppColors";
import { useReportsData } from "../hooks/useReportsData";
import { useCustomToast } from "../contexts/ToastProvider";
import { getReports } from "../services/reportsService";
import KPISection from "../components/reports/KPISection";
import FlavorSalesChart from "../components/reports/FlavorSalesChart";
import OnDemandVsStockChart from "../components/reports/OnDemandVsStockChart";
import PaymentMethodChart from "../components/reports/PaymentMethodChart";
import RevenueVsReceivedChart from "../components/reports/RevenueVsReceivedChart";
import SalesByPeriodChart from "../components/reports/SalesByPeriodChart";
import OrdersByStatusChart from "../components/reports/OrdersByStatusChart";
import ResponsiveChartRow from "../components/reports/ResponsiveChartRow";

export default function ReportsScreen() {
    const { backgroundColor, secondaryColor, mediumGreyColor } = useAppColors();
    const toast = useCustomToast();

    const [reportData, setReportData] = useState<ReportData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getReports();
            setReportData(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os relatórios. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const {
        ordersByStatusData,
        onDemandVsStockData,
        flavorData,
        allSizes,
        salesByPeriodData,
        revenueChartData,
    } = useReportsData(reportData);

    if (isLoading || !reportData) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando relatórios...
                </Text>
            </Center>
        );
    }

    return (
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
                        <KPISection kpis={reportData.kpis} />
                        <SalesByPeriodChart data={salesByPeriodData} />
                        <ResponsiveChartRow>
                            <OrdersByStatusChart data={ordersByStatusData} />
                            <OnDemandVsStockChart data={onDemandVsStockData} />
                        </ResponsiveChartRow>
                        <FlavorSalesChart data={flavorData} sizes={allSizes} />
                        <ResponsiveChartRow>
                            <RevenueVsReceivedChart data={revenueChartData} />
                            <PaymentMethodChart
                                data={
                                    reportData.financials
                                        .receivedByPaymentMethod
                                }
                            />
                        </ResponsiveChartRow>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    );
}
