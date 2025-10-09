export interface Price {
    size: string;
    sale_price: number;
    cost_price: number;
}

export interface Flavor {
    id: number;
    flavor: string;
    prices: Price[];
}

interface PriceInput {
    size: string;
    sale_price: string;
    cost_price: string;
}

export interface InputData {
    flavor: string;
    prices: PriceInput[];
}

export type FlavorFormData = Omit<Flavor, "id">;
