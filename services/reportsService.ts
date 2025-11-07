import api from "./api";
import { ReportData } from "../types/reports";

export type PeriodType = "DAY" | "WEEK" | "MONTH";

export interface GetReportsParams {
    startDate: string;
    endDate: string;
    periodType: PeriodType;
}

export const getReports = async (
    params: GetReportsParams,
): Promise<ReportData> => {
    const { startDate, endDate, periodType } = params;

    const response = await api.get(
        `/reports/dashboard?startDate=${startDate}&endDate=${endDate}&periodType=${periodType}`,
    );
    return response.data;
};
