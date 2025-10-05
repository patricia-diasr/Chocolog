import { NavigatorScreenParams } from "@react-navigation/native";
import { TAB_CONFIG } from "../configs/navigation";

export type CustomerStackParamList = {
    CustomersList: undefined;
    Customer: { customerId: string }; 
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
    Order: { orderId: string }; 
};

export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<MobileTabParamList>;
    Menu: { onLogout: () => void };
    FlavorList: undefined;
    Employees: undefined;
    Customer: { customerId: string };
    Order: { orderId: string };
};

export type AuthStackParamList = {
    Login: undefined;
};
