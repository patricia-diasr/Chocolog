import api from "./api";
import { ReportData } from "../types/reports";

export const getReports = async (): Promise<ReportData> => {
    const response = await api.get(
        "/reports/dashboard?startDate=2025-01-01&endDate=2025-12-31",
    );
    return response.data;
};
