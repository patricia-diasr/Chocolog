import { StockStatus } from "./stock";

export interface FlavorSize {
    sizeId: number;
    name: string;
    salePrice: number;
    costPrice: number;
    totalQuantity: number;
    remainingQuantity: number;
}

export interface Flavor {
    id: number;
    name: string;
    sizes: FlavorSize[];
    status?: StockStatus;
}

export interface PriceFormData {
    size: string;
    salePrice: number;
    costPrice: number;
}

export interface FlavorFormData {
    flavor: string;
    prices: PriceFormData[];
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
