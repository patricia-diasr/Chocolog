import { ScheduleScreen } from "../screens/schedule";
import { StockScreen } from "../screens/stock";
import { ReportsScreen } from "../screens/reports";
import CustomersScreen from "../screens/customers";
import { ComponentType } from "react";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

export const TAB_CONFIG = {
    schedule: {
        icon: "calendar" as IconName,
        label: "Agenda",
        title: "Agenda",
        component: ScheduleScreen as ComponentType<any>,
    },
    customers: {
        icon: "people" as IconName,
        label: "Clientes",
        title: "Clientes",
        component: CustomersScreen as ComponentType<any>,
    },
    stock: {
        icon: "cube" as IconName,
        label: "Estoque",
        title: "Estoque",
        component: StockScreen as ComponentType<any>,
    },
    reports: {
        icon: "print" as IconName,
        label: "Imprimir",
        title: "Imprimir",
        component: ReportsScreen as ComponentType<any>,
    },
} as const;

export type TabName = keyof typeof TAB_CONFIG;

export const TAB_ENTRIES = Object.entries(TAB_CONFIG) as [
    TabName,
    (typeof TAB_CONFIG)[TabName],
][];

export const MENU_ITEMS = [
    {
        name: "Gerenciar Sabores",
        subtitle: "Adicione, edite ou remova sabores",
        icon: "ice-cream" as IconName,
        route: "Sabores",
    },
    {
        name: "Agenda",
        subtitle: "Visualize e gerencie o pedidos agendados",
        icon: "calendar" as IconName,
        route: "Agenda",
    },
    {
        name: "Estoque",
        subtitle: "Gerencie o estoque de produtos",
        icon: "cube" as IconName,
        route: "Estoque",
    },
    {
        name: "Lotes de Impressão",
        subtitle: "Gerencie a impressão de pedidos",
        icon: "print" as IconName,
        route: "Imprimir",
    },
    {
        name: "Clientes",
        subtitle: "Visualize e gerencie clientes",
        icon: "people" as IconName,
        route: "Clientes",
    },
    {
        name: "Funcionários",
        subtitle: "Visualize e gerencie funcionários",
        icon: "person-circle" as IconName,
        route: "Funcionarios",
    },
];
