export const STOCK_STATUS = {
    low: {
        color: "error",
        label: "Baixo",
        icon: "alert-circle",
    },
    medium: {
        color: "warning",
        label: "Médio",
        icon: "warning",
    },
    high: {
        color: "success",
        label: "Alto",
        icon: "checkmark-circle",
    },
} as const;

export type StockStatus = (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];
