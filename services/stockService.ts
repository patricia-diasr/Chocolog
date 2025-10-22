import api from "./api";
import { RecordItem, StockRecord } from "../types/stock";

export const getRecords = async (): Promise<StockRecord[]> => {
    const response = await api.get("/stock-records");
    return response.data;
};

export const createRecord = async (
    recordData: Omit<RecordItem, "id">,
): Promise<StockRecord> => {
    const response = await api.post("/stock-records", recordData);
    return response.data;
};