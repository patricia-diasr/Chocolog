import React from "react";
import { useAppColors } from "../../hooks/useAppColors";
import { Box } from "native-base";
import { ChartDataItem } from "../../types/reports";
import {
    PieChart as RechartsPieChart,
    Pie as RechartsPie,
    Cell as RechartsCell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";
import { ResponsiveValue } from "native-base/lib/typescript/components/types";

const ResponsiveContainer = RechartsResponsiveContainer as any;
const PieChart = RechartsPieChart as any;
const Pie = RechartsPie as any;
const Tooltip = RechartsTooltip as any;
const Cell = RechartsCell as any;

interface Props {
    data: ChartDataItem[];
    h?: ResponsiveValue<string | number>;
}

export default function OrdersByStatusChart({ data, h }: Props) {
    const { lightGreyColor } = useAppColors();

    return (
        <ChartCard title="Pedidos por Status" icon="clipboard">
            <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: `1px solid ${lightGreyColor}`,
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </ChartCard>
    );
}
