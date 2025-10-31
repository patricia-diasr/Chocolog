import { OrderStatus } from "./order";

export type SizeSale = {
    size: string;
    quantity: number;
}

export type FlavorSale = {
    flavor: string;
    sizeSales: SizeSale[];
}

export type SalesByPeriod = {
    period: string;
    totalSold: number;
}

export type OrderByStatus = {
    status: OrderStatus;
    count: number;
}

export type OnDemandVsStock = {
    type: "ON_DEMAND" | "STOCK";
    quantity: number;
}

export type RevenueVsReceived = {
    period: string;
    revenue: number;
    received: number;
}

export type PaymentMethod = {
    method: string;
    amount: number;
}

export type KPIs = {
    totalSold: number;
    totalRevenue: number;
    totalReceived: number;
    estimatedProfit: number;
}

export type ReportData = {
    periodStart: string;
    periodEnd: string;
    kpis: KPIs;
    salesByPeriod: SalesByPeriod[];
    ordersByStatus: OrderByStatus[];
    totalByFlavorAndSize: FlavorSale[];
    onDemandVsStock: OnDemandVsStock[];
    financials: {
        revenueVsReceivedByPeriod: RevenueVsReceived[];
        receivedByPaymentMethod: PaymentMethod[];
    };
}

export type StatusInfo = {
    label: string;
    color: string;
}

export type ChartDataItem = {
    name: string;
    value: number;
    color: string;
}

export type FlavorChartData = {
    flavor: string;
    total: number;
    [key: string]: string | number;
}
