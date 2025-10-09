import { OrderDetail } from "../types/order";

export const formatPrice = (value: number): string => {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
        });
    } catch (error) {
        return "Data inválida";
    }
};

export const formatOrderDetailTitle = (detail: OrderDetail): string => {
    const baseTitle = `${detail.quantity}x ${detail.size} - ${detail.flavor1}`;
    return detail.flavor2 ? `${baseTitle} / ${detail.flavor2}` : baseTitle;
};

export const formatOrderDetailTitleWithNotes = (detail: OrderDetail): string => {
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