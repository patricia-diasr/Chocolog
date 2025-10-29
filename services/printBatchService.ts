import { PrintBatch, PrintBatchDetail, PrintBatchRequest } from "../types/prints";
import api from "./api";

export const getPrintBatchs = async (): Promise<PrintBatch[]> => {
    const response = await api.get("/orders/print-batchs");
    return response.data;
};

export const getPrintBatch = async (id: number): Promise<PrintBatchDetail> => {
    const response = await api.get(`/orders/print-batchs/${id}`);
    return response.data;
};

export const createPrintBatch = async (
    printBatchData: PrintBatchRequest,
): Promise<PrintBatchDetail> => {
    const response = await api.post("/orders/print-batchs", printBatchData);
    return response.data;
};

export const downloadPrintBatch = async (id: number): Promise<Blob> => {
    const response = await api.get(`/orders/print-batchs/${id}/download`, {
        responseType: "blob", 
    });
    return response.data;
};