type StatusConfig = {
    [key: string]: {
        label: string;
        colorScheme: string;
        icon: string;
    };
};

export const statusConfig: StatusConfig = {
    completed: {
        label: "Concluído",
        colorScheme: "success",
        icon: "checkmark-done",
    },
    paid: {
        label: "Pago",
        colorScheme: "success",
        icon: "card",
    },
    pending: {
        label: "Pendente",
        colorScheme: "warning",
        icon: "time",
    },
    cancelled: {
        label: "Cancelado",
        colorScheme: "error",
        icon: "close-circle",
    },
    overdue: {
        label: "Vencido",
        colorScheme: "error",
        icon: "alert-circle",
    },
    default: {
        label: "Info",
        colorScheme: "info",
        icon: "information-circle",
    },
};

export const getStatusDetails = (status: string) => {
    return statusConfig[status] || statusConfig.default;
};
