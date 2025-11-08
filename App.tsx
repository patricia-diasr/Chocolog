import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { NativeBaseProvider } from "native-base";
import { useFonts } from "expo-font";
import { BerkshireSwash_400Regular } from "@expo-google-fonts/berkshire-swash";
import * as SplashScreen from "expo-splash-screen";
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { ToastProvider } from "./contexts/ToastProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigator } from "./navigation/index";
import { theme } from "./theme";
import "./configs/calendar.ts";

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded, fontError] = useFonts({
        BerkshireSwash_400Regular,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    useEffect(() => {
        if (fontError) {
            console.error("ERRO NO CARREGAMENTO DA FONTE:", fontError);
        }
    }, [fontError]);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View
            style={{ flex: 1, overflow: "hidden" }}
            onLayout={onLayoutRootView}
        >
            <NativeBaseProvider theme={theme}>
                <ToastProvider>
                    <AuthProvider>
                        <Navigator />
                    </AuthProvider>
                </ToastProvider>
            </NativeBaseProvider>
        </View>
    );
}
