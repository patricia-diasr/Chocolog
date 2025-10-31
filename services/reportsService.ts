import { ReportData } from "../types/reports";
import api from "./api";

export const getReports = async (): Promise<ReportData> => {
    const response = await api.get(
        "/reports/dashboard?startDate=2025-01-01&endDate=2025-12-31",
    );
    return response.data;
};
