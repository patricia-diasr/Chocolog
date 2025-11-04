import { STOCK_STATUS } from "../configs/stock";
import { StockStatus } from "../types/stock";

type StatusConfig = {
    [key: string]: {
        label: string;
        colorScheme: string;
        icon: string;
    };
};

export const statusConfig: StatusConfig = {
    COMPLETED: {
        label: "Concluído",
        colorScheme: "success",
        icon: "checkmark-done",
    },
    PAID: {
        label: "Pago",
        colorScheme: "success",
        icon: "card",
    },
    PENDING: {
        label: "Pendente",
        colorScheme: "warning",
        icon: "time",
    },
    UNPAID: {
        label: "Pendente",
        colorScheme: "warning",
        icon: "time",
    },
    PARTIAL: {
        label: "Parcialmente Pago",
        colorScheme: "warning",
        icon: "pie-chart",
    },
    READY_FOR_PICKUP: {
        label: "Pronto",
        colorScheme: "info",
        icon: "checkmark-circle",
    },
    CANCELLED: {
        label: "Cancelado",
        colorScheme: "error",
        icon: "close-circle",
    },
    OVERDUE: {
        label: "Vencido",
        colorScheme: "error",
        icon: "alert-circle",
    },
    DEFAULT: {
        label: "Info",
        colorScheme: "info",
        icon: "information-circle",
    },
};

export const getStatusDetails = (status: string) => {
    return statusConfig[status] || statusConfig.DEFAULT;
};

const LOW_STOCK_THRESHOLD = 20;
const MEDIUM_STOCK_THRESHOLD = 60;

export const getFlavorStockStatus = (
    totalQuantity: number,
    remainingQuantity: number,
): StockStatus => {
    if (totalQuantity < 0) {
        return STOCK_STATUS.LOW;
    }

    if (totalQuantity === 0 && remainingQuantity === 0) {
        return STOCK_STATUS.OUT_OF_STOCK;
    }

    if (totalQuantity === 0) {
        return STOCK_STATUS.LOW;
    }

    const percentage = (remainingQuantity / totalQuantity) * 100;

    if (percentage <= LOW_STOCK_THRESHOLD) {
        return STOCK_STATUS.LOW;
    }
    
    if (percentage <= MEDIUM_STOCK_THRESHOLD) {
        return STOCK_STATUS.MEDIUM;
    }

    return STOCK_STATUS.HIGH;
};
