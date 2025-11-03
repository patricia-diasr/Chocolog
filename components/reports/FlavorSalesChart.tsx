import React from "react";
import { useAppColors } from "../../hooks/useAppColors";
import { Box } from "native-base";
import { FlavorChartData } from "../../types/reports";
import {
    BarChart as RechartsBarChart,
    Bar as RechartsBar,
    XAxis as RechartsXAxis,
    YAxis as RechartsYAxis,
    CartesianGrid as RechartsCartesianGrid,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend,
    ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";

const ResponsiveContainer = RechartsResponsiveContainer as any;
const BarChart = RechartsBarChart as any;
const Bar = RechartsBar as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const CartesianGrid = RechartsCartesianGrid as any;
const Tooltip = RechartsTooltip as any;
const Legend = RechartsLegend as any;

interface Props {
    data: FlavorChartData[];
    sizes: string[];
}

export default function FlavorSalesChart({
    data,
    sizes
}: Props) {
    const { whiteColor, lightGreyColor, mediumGreyColor } = useAppColors();
    const sizeColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

    return (
        <ChartCard title="Vendas por Sabor e Tamanho" icon="ice-cream">
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
                            dataKey="flavor"
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
                        {sizes.map((size, index) => (
                            <Bar
                                key={size}
                                dataKey={size}
                                stackId="a"
                                fill={sizeColors[index % sizeColors.length]}
                                name={size}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </ChartCard>
    );
}
