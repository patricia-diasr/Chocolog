import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    ReportData,
    ChartDataItem,
    FlavorChartData,
    FlavorSale,
    OnDemandVsStock,
    OrderByStatus,
    StatusInfo,
} from "../types/reports";
import { OrderStatus } from "../types/order";

const useStatusLabels = (): Record<OrderStatus, StatusInfo> => {
    return useMemo(
        () => ({
            PENDING: { label: "Pendente", color: "#F59E0B" },
            READY_FOR_PICKUP: { label: "Pronto", color: "#3B82F6" },
            COMPLETED: { label: "Entregue", color: "#10B981" },
            CANCELLED: { label: "Cancelado", color: "#EF4444" },
        }),
        [],
    );
};

const useOrdersByStatusData = (
    data: OrderByStatus[] | undefined,
    statusLabels: Record<OrderStatus, StatusInfo>,
): ChartDataItem[] => {
    return useMemo(() => {
        if (!data) return [];
        return data.map((item) => ({
            name: statusLabels[item.status]?.label || item.status,
            value: item.count,
            color: statusLabels[item.status]?.color || "gray.500",
        }));
    }, [data, statusLabels]);
};

const useOnDemandVsStockData = (
    data: OnDemandVsStock[] | undefined,
): ChartDataItem[] => {
    return useMemo(() => {
        if (!data) return [];
        return data.map((item) => ({
            name: item.type === "ON_DEMAND" ? "Sob-demanda" : "Estoque",
            value: item.quantity,
            color: item.type === "ON_DEMAND" ? "#8B5CF6" : "#3B82F6",
        }));
    }, [data]);
};

const useFlavorSalesData = (
    data: FlavorSale[] | undefined,
): { flavorData: FlavorChartData[]; allSizes: string[] } => {
    return useMemo(() => {
        if (!data) return { flavorData: [], allSizes: [] };

        const sizes = new Set<string>();
        data.forEach((flavor) => {
            flavor.sizeSales.forEach((size) => sizes.add(size.size));
        });

        const flavorData = data.map((flavor) => {
            const total = flavor.sizeSales.reduce(
                (sum, size) => sum + size.quantity,
                0,
            );
            const sizeData = flavor.sizeSales.reduce((acc, size) => {
                acc[size.size] = size.quantity;
                return acc;
            }, {} as Record<string, number>);

            return {
                flavor: flavor.flavor,
                total,
                ...sizeData,
            };
        });

        return { flavorData, allSizes: Array.from(sizes) };
    }, [data]);
};

const useSalesByPeriodData = (
    data: { period: string; totalSold: number }[] | undefined,
): ChartDataItem[] => {
    return useMemo(() => {
        if (!data) return [];
        return data.map((item) => {
            const weekDate = parseISO(item.period);
            const formattedName = format(weekDate, "dd/MM", { locale: ptBR });

            return {
                name: formattedName,
                value: item.totalSold,
                color: "#10B981",
            };
        });
    }, [data]);
};

const useRevenueChartData = (
    data: { period: string; revenue: number; received: number }[] | undefined,
) => {
    return useMemo(() => {
        if (!data) return [];
        return data.map((item) => {
            const weekDate = parseISO(item.period);
            const formattedName = format(weekDate, "dd/MM", { locale: ptBR });

            return {
                name: formattedName,
                Faturado: item.revenue,
                Recebido: item.received,
            };
        });
    }, [data]);
};

export const useReportsData = (reportData: ReportData | undefined) => {
    const statusLabels = useStatusLabels();

    const ordersByStatusData = useOrdersByStatusData(
        reportData?.ordersByStatus,
        statusLabels,
    );
    const onDemandVsStockData = useOnDemandVsStockData(
        reportData?.onDemandVsStock,
    );
    const { flavorData, allSizes } = useFlavorSalesData(
        reportData?.totalByFlavorAndSize,
    );
    const salesByPeriodData = useSalesByPeriodData(reportData?.salesByPeriod);
    const revenueChartData = useRevenueChartData(
        reportData?.financials.revenueVsReceivedByPeriod,
    );

    return {
        ordersByStatusData,
        onDemandVsStockData,
        flavorData,
        allSizes,
        salesByPeriodData,
        revenueChartData,
    };
};
