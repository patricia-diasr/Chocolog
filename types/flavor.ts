export interface Price {
    size: string;
    salePrice: number; 
    costPrice: number; 
}

export interface Flavor {
    id: number;
    flavor: string;
    prices: Price[];
}

interface PriceInput {
    size: string;
    salePrice: string; 
    costPrice: string; 
}

export interface InputData {
    flavor: string;
    prices: PriceInput[];
}

export type FlavorFormData = Omit<Flavor, "id">;
