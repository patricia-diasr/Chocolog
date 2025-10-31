import React from "react";
import { useAppColors } from "../../hooks/useAppColors";
import { Box } from "native-base";
import { ChartDataItem } from "../../types/reports";
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

const ResponsiveContainer = RechartsResponsiveContainer as any;
const LineChart = RechartsLineChart as any;
const Line = RechartsLine as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const CartesianGrid = RechartsCartesianGrid as any;
const Tooltip = RechartsTooltip as any;
const Legend = RechartsLegend as any;

interface Props {
    data: ChartDataItem[];
}

export default function SalesByPeriodChart({ data }: Props) {
    const { lightGreyColor, mediumGreyColor } = useAppColors();

    return (
        <ChartCard title="Vendas por Período" icon="analytics">
            <Box h="250px">
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
                        <YAxis tick={{ fill: mediumGreyColor, fontSize: 11 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: `1px solid ${lightGreyColor}`,
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Ovos Vendidos"
                            dot={{ fill: "#3B82F6", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </ChartCard>
    );
}
