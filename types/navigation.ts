import { NavigatorScreenParams } from "@react-navigation/native";
import { ScreenConfigMap, AppScreenName } from "../configs/navigation";

export type CustomerStackParamList = {
    CustomersList: undefined;
    Customer: { customerId: number };
};

type GetKeysWithProperty<T, Prop extends string> = {
    [K in keyof T]: T[K] extends { [key in Prop]?: true } ? K : never;
}[keyof T];

type TabScreenNames = GetKeysWithProperty<ScreenConfigMap, "isTab">;

export type MobileTabParamList = {
    [K in TabScreenNames]: undefined;
};

export type RootDrawerParamList = {
    [K in AppScreenName]: K extends "Customers"
        ? NavigatorScreenParams<CustomerStackParamList>
        : K extends "Order"
        ? { customerId: number; orderId: number }
        : K extends "Customer"
        ? { customerId: number }
        : K extends "PrintBatch"
        ? { printBatchId: number }
        : K extends "Menu" 
        ? { onLogout: () => void }
        : undefined; 
};

export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<MobileTabParamList>;
    Menu: { onLogout: () => void };
    FlavorList: undefined;
    Employees: undefined;
    Customer: { customerId: number };
    Order: { customerId: number; orderId: number };
    PrintBatch: { printBatchId: number };
};

export type AuthStackParamList = {
    Login: undefined;
};
