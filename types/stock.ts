export type StockStatus = {
    color: "error" | "warning" | "success" | "info";
    label: string;
    icon: string;
};

export type StockSize = {
    size: string;
    quantity: number;
};

export type StockRecord = {
    id?: number;
    flavorName: string;
    sizeName: string;
    quantity: number;
    productionDate: string;
    expirationDate?: string;
    movementType: "INBOUND" | "OUTBOUND";
};

export type RecordItem = {
    sizeId: number;
    flavorId: number;
    quantity: number;
    movementType: "INBOUND" | "OUTBOUND";
};
