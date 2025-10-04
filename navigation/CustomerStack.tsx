import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomerStackParamList } from "../types/navigation";
import CustomersScreen from "../screens/customers";
import CustomerScreen from "../screens/customer";

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CustomersList" component={CustomersScreen} />
            <Stack.Screen name="Customer" component={CustomerScreen} />
        </Stack.Navigator>
    );
}
