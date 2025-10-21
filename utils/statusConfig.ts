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
