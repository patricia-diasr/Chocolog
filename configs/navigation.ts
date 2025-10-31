import { ComponentType } from "react";
import { Ionicons } from "@expo/vector-icons";
import ScheduleScreen from "../screens/schedule";
import CustomersScreen from "../screens/customers";
import StockScreen from "../screens/stock";
import PrintBatchsScreen from "../screens/print-batchs";
import EmployeesScreen from "../screens/employees";
import FlavorListScreen from "../screens/flavor-list";
import OrderScreen from "../screens/order";
import CustomerScreen from "../screens/customer";
import MenuScreen from "../screens/menu";
import PrintBatchScreen from "../screens/print-batch";
import NewPrintBatchScreen from "../screens/new-print-batch";
import ReportsScreen from "../screens/reports";

type IconName = keyof typeof Ionicons.glyphMap;

export interface ScreenConfig {
    component: ComponentType<any>;
    title: string;
    icon?: IconName;
    subtitle?: string;
    isTab?: boolean;
    isMenuItem?: boolean;
}

export const SCREEN_CONFIG: Record<string, ScreenConfig> = {
    Schedule: {
        component: ScheduleScreen,
        title: "Agenda",
        icon: "calendar",
        subtitle: "Visualize e gerencie os pedidos agendados",
        isTab: true,
        isMenuItem: true,
    },
    Customers: {
        component: CustomersScreen,
        title: "Clientes",
        icon: "people",
        subtitle: "Visualize e gerencie clientes",
        isTab: true,
        isMenuItem: true,
    },
    Stock: {
        component: StockScreen,
        title: "Estoque",
        icon: "cube",
        subtitle: "Gerencie o estoque de produtos",
        isTab: true,
        isMenuItem: true,
    },
    Prints: {
        component: PrintBatchsScreen,
        title: "Impressões",
        icon: "print",
        subtitle: "Gerencie a impressão de pedidos",
        isTab: true,
        isMenuItem: true,
    },
    Employees: {
        component: EmployeesScreen,
        title: "Funcionários",
        icon: "person-circle",
        subtitle: "Visualize e gerencie funcionários",
        isMenuItem: true,
    },
    FlavorList: {
        component: FlavorListScreen,
        title: "Sabores",
        icon: "ice-cream",
        subtitle: "Adicione, edite ou remova sabores",
        isMenuItem: true,
    },
    Reports: {
        component: ReportsScreen,
        title: "Relatórios",
        icon: "bar-chart",
        subtitle: "Visualize relatórios de venda e produção",
        isMenuItem: true,
    },
    Order: {
        component: OrderScreen,
        title: "Pedido",
    },
    Customer: {
        component: CustomerScreen,
        title: "Cliente",
    },
    PrintBatch: {
        component: PrintBatchScreen,
        title: "Impressão",
    },
    NewPrintBatch: {
        component: NewPrintBatchScreen,
        title: "Imprimir Pedidos",
    },
    Menu: {
        component: MenuScreen,
        title: "Menu",
    },
};

export type AppScreenName = keyof typeof SCREEN_CONFIG;

export const TAB_ROUTES = Object.entries(SCREEN_CONFIG).filter(
    ([_, config]) => config.isTab,
);

export const MENU_ITEMS = Object.entries(SCREEN_CONFIG)
    .filter(([_, config]) => config.isMenuItem)
    .map(([name, config]) => ({
        name: config.title,
        subtitle: config.subtitle,
        icon: config.icon,
        route: name as AppScreenName,
    }));
