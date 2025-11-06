import React from "react";
import { Box } from "native-base";
import { ResponsiveValue } from "native-base/lib/typescript/components/types";
import {
    BarChart as RechartsBarChart,
    Bar as RechartsBar,
    Cell as RechartsCell,
    XAxis as RechartsXAxis,
    YAxis as RechartsYAxis,
    CartesianGrid as RechartsCartesianGrid,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend,
    ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
import { useAppColors } from "../../hooks/useAppColors";
import { ChartDataItem } from "../../types/reports";
import ChartCard from "./ChartCard";

const ResponsiveContainer = RechartsResponsiveContainer as any;
const BarChart = RechartsBarChart as any;
const Bar = RechartsBar as any;
const Cell = RechartsCell as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const CartesianGrid = RechartsCartesianGrid as any;
const Tooltip = RechartsTooltip as any;
const Legend = RechartsLegend as any;

interface Props {
    data: ChartDataItem[];
    h?: ResponsiveValue<string | number>;
}

export default function OnDemandVsStockChart({ data, h }: Props) {
    const { whiteColor, lightGreyColor, mediumGreyColor } = useAppColors();

    return (
        <ChartCard title="Sob-demanda vs Estoque" icon="cube">
            <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
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
                                backgroundColor: whiteColor,
                                border: `1px solid ${lightGreyColor}`,
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar
                            dataKey="value"
                            name="Quantidade"
                            radius={[8, 8, 0, 0]}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </ChartCard>
    );
}
