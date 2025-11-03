import React from "react";
import { useAppColors } from "../../hooks/useAppColors";
import { Box } from "native-base";
import {
    LineChart as RechartsLineChart,
    Line as RechartsLine,
    XAxis as RechartsXAxis,
    YAxis as RechartsYAxis,
    CartesianGrid as RechartsCartesianGrid,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend,
    ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";
import { formatPrice } from "../../utils/formatters";
import { ResponsiveValue } from "native-base/lib/typescript/components/types";

const ResponsiveContainer = RechartsResponsiveContainer as any;
const LineChart = RechartsLineChart as any;
const Line = RechartsLine as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const CartesianGrid = RechartsCartesianGrid as any;
const Tooltip = RechartsTooltip as any;
const Legend = RechartsLegend as any;

interface RevenueChartData {
    name: string;
    Faturado: number;
    Recebido: number;
}

interface Props {
    data: RevenueChartData[];
    h?: ResponsiveValue<string | number>;
}

export default function RevenueVsReceivedChart({ data, h }: Props) {
    const { whiteColor, lightGreyColor, mediumGreyColor } = useAppColors();

    return (
        <ChartCard title="Faturamento vs Recebido" icon="stats-chart">
            <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={lightGreyColor}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: mediumGreyColor, fontSize: 11 }}
                        />
                        <YAxis
                            tick={{ fill: mediumGreyColor, fontSize: 11 }}
                            tickFormatter={(value: number) =>
                                formatPrice(value)
                            }
                        />
                        <Tooltip
                            formatter={(value: number) => formatPrice(value)}
                            contentStyle={{
                                backgroundColor: whiteColor,
                                border: `1px solid ${lightGreyColor}`,
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line
                            type="monotone"
                            dataKey="Faturado"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Faturamento"
                            dot={{ fill: "#3B82F6", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Recebido"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="Recebido"
                            dot={{ fill: "#10B981", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </ChartCard>
    );
}
