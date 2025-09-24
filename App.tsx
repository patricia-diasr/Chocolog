import React, { useCallback } from "react";
import { NativeBaseProvider } from "native-base";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { theme } from "./theme";
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded, fontError] = useFonts({
        Poppins_400Regular: require("./assets/fonts/Poppins-Regular.ttf"),
        Poppins_500Medium: require("./assets/fonts/Poppins-Medium.ttf"),
        Poppins_600SemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
        Poppins_700Bold: require("./assets/fonts/Poppins-Bold.ttf"),
        BerkshireSwash_400Regular: require("./assets/fonts/BerkshireSwash-Regular.ttf"),
    });

    React.useEffect(() => {
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
            </NativeBaseProvider>
        </View>
    );
}
