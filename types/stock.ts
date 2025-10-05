export type StockStatus = {
    color: "error" | "warning" | "success";
    label: string;
    icon: string;
};

export type StockSize = {
    size: string;
    quantity: number;
};

export type StockItem = {
    flavor: string;
    sizes: StockSize[];
    status: StockStatus;
};

export type StockRecord = {
    date: string;
    type: "+" | "-";
    quantity: number;
    flavor: string;
    size: string;
};

export type RecordItem = {
    type: "+" | "-";
    quantity: number;
    flavor: string;
    size: string;
};
