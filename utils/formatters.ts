import { OrderItemResponse } from "../types/order";

export const formatPrice = (value: number): string => {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
        });
    } catch (error) {
        return "Data inválida";
    }
};

export const applyDateMask = (text: string): string => {
    const digits = text.replace(/\D/g, "");
    const maxLength = 8;
    const truncated = digits.slice(0, maxLength);

    if (truncated.length > 4) {
        return truncated.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (truncated.length > 2) {
        return truncated.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    } else {
        return truncated;
    }
};

export const parseInputDate = (dateString: string): string => {
    const parts = dateString.split("/");
    if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);

        if (
            String(year).length === 4 &&
            year > 1900 &&
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= 31
        ) {
            try {
                const isoFormatDate = new Date(
                    `${year}-${month.toString().padStart(2, "0")}-${day
                        .toString()
                        .padStart(2, "0")}T12:00:00Z`,
                );

                if (
                    isoFormatDate.getUTCDate() === day &&
                    isoFormatDate.getUTCMonth() + 1 === month
                ) {
                    return isoFormatDate.toISOString();
                }
            } catch (e) {
                return "";
            }
        }
    }
    return "";
};

export const formatOrderDetailTitle = (detail: OrderItemResponse): string => {
    const baseTitle = `${detail.quantity}x ${detail.sizeName} - ${detail.flavor1Name}`;
    return detail.flavor2Name
        ? `${baseTitle} / ${detail.flavor2Name}`
        : baseTitle;
};

export const formatOrderDetailTitleWithNotes = (
    detail: OrderItemResponse,
): string => {
    const title = formatOrderDetailTitle(detail);
    return detail.notes ? `${title}\n(${detail.notes})` : title;
};

export const maskPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");

    return value;
};

export const unmaskPhone = (value: string) => value.replace(/\D/g, "") || "";

export const normalizeText = (text: string) =>
    text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
