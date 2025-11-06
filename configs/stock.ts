export const STOCK_STATUS = {
    LOW: {
        color: "error",
        label: "Baixo",
        icon: "alert-circle",
    },
    MEDIUM: {
        color: "warning",
        label: "Médio",
        icon: "warning",
    },
    HIGH: {
        color: "success",
        label: "Alto",
        icon: "checkmark-circle",
    },
    OUT_OF_STOCK: {
        color: "info",
        label: "Sem Estoque",
        icon: "information-circle",
    },
} as const;
