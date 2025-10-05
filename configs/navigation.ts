import { ComponentType } from "react";
import { Ionicons } from "@expo/vector-icons";
import ScheduleScreen from "../screens/schedule";
import CustomersScreen from "../screens/customers";
import StockScreen from "../screens/stock";
import { PrintsScreen } from "../screens/prints";
import { EmployeesScreen } from "../screens/employees";
import { FlavorListScreen } from "../screens/flavor-list";
import OrderScreen from "../screens/order";
import CustomerScreen from "../screens/customer";
import MenuScreen from "../screens/menu";

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
        component: PrintsScreen,
        title: "Imprimir",
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
    Order: {
        component: OrderScreen,
        title: "Pedido",
    },
    Customer: {
        component: CustomerScreen,
        title: "Cliente",
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
