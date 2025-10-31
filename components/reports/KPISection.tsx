import React from "react";
import { HStack } from "native-base";
import KPICard from "./KPICard";
import { formatPrice } from "../../utils/formatters";
import { KPIs } from "../../types/reports";

interface Props {
    kpis: KPIs;
}

export default function KPISection({ kpis }: Props) {
    return (
        <HStack space={4} flexWrap="wrap">
            <KPICard
                title="Total de Ovos"
                subtitle="Unidades vendidas"
                value={kpis.totalSold.toString()}
                icon="egg"
            />
            <KPICard
                title="Faturamento Bruto"
                subtitle="Total em vendas"
                value={formatPrice(kpis.totalRevenue)}
                icon="cash"
            />
            <KPICard
                title="Valor Recebido"
                subtitle="Pagamentos confirmados"
                value={formatPrice(kpis.totalReceived)}
                icon="checkmark-circle"
            />
            <KPICard
                title="Lucro Estimado"
                subtitle="Receita - Custos"
                value={formatPrice(kpis.estimatedProfit)}
                icon="trending-up"
            />
        </HStack>
    );
}
