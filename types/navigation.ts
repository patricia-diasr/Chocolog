import { NavigatorScreenParams } from "@react-navigation/native";
import { TAB_CONFIG } from "../configs/navigation";

export type CustomerStackParamList = {
    CustomersList: undefined;
    Customer: { customerId: number };
};

export type MobileTabParamList = {
    [K in keyof typeof TAB_CONFIG]: undefined;
};

export type RootDrawerParamList = {
    [K in keyof typeof TAB_CONFIG as (typeof TAB_CONFIG)[K]["title"]]: K extends "customers"
        ? NavigatorScreenParams<CustomerStackParamList>
        : undefined;
} & {
    FlavorList: undefined;
    Employees: undefined;
    Order: { customerId: number; orderId: number };
};

export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<MobileTabParamList>;
    Menu: { onLogout: () => void };
    FlavorList: undefined;
    Employees: undefined;
    Customer: { customerId: number };
    Order: { customerId: number; orderId: number };
    PrintBatch: { printBatchId : number }
};

export type AuthStackParamList = {
    Login: undefined;
};
