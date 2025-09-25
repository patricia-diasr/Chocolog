import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useCallback, useEffect } from "react";
import { NativeBaseProvider } from "native-base";
import { useFonts } from "expo-font";
import { BerkshireSwash_400Regular } from "@expo-google-fonts/berkshire-swash";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { theme } from "./theme";
import { Navigator } from "./navigation/Navigator";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";

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
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NativeBaseProvider theme={theme}>
                <Navigator />
            </NativeBaseProvider>
        </View>
    );
}
