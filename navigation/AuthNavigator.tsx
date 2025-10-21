import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import LoginScreen from "../screens/login";

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {
    onLogin: () => void;
}

export default function AuthNavigator({ onLogin }: Props) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
