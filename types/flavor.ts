export interface FlavorSize {
	sizeId: number;
	name: string;
	salePrice: number;
	costPrice: number;
	totalQuantity: number;
	remainingQuantity: number;
}

export interface Flavor {
	id: string;
	name: string; 
	sizes: FlavorSize[]; 
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