import React from "react";
import { Box } from "native-base";
import { ResponsiveValue } from "native-base/lib/typescript/components/types";
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
import { useAppColors } from "../../hooks/useAppColors";
import { formatPrice } from "../../utils/formatters";
import { PaymentMethod } from "../../types/reports";
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
    data: PaymentMethod[];
    h?: ResponsiveValue<string | number>;
}

export default function PaymentMethodChart({ data, h }: Props) {
    const { whiteColor, lightGreyColor, mediumGreyColor } = useAppColors();

    return (
        <ChartCard title="Métodos de Pagamento" icon="card">
            <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={lightGreyColor}
                        />
                        <XAxis
                            type="number"
                            tick={{ fill: mediumGreyColor, fontSize: 11 }}
                        />
                        <YAxis
                            dataKey="method"
                            type="category"
                            tick={{ fill: mediumGreyColor, fontSize: 11 }}
                            width={60}
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
                        <Bar
                            dataKey="amount"
                            fill="#10B981"
                            name="Valor Recebido"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </ChartCard>
    );
}
