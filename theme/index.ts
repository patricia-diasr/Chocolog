import { extendTheme } from "native-base";

export const theme = extendTheme({
    colors: {
        primary: {
            50: "#f4fdfd",
            100: "#c8f2f2",
            200: "#9ce7e7",
            300: "#6fdcdc",
            400: "#43d1d1",
            500: "#29b8b8",
            600: "#1f8f8f",
            700: "#166666",
            800: "#0d3d3d",
            900: "#041515",
        },
        secondary: {
            50: "#ffe5ec",
            100: "#fbb8c5",
            200: "#f48aa0",
            300: "#ed5b7a",
            400: "#e62d55",
            500: "#cc143c",
            600: "#a10f30",
            700: "#760a24",
            800: "#4b0618",
            900: "#21020c",
        },
        tertiary: {
            50: "#f7edea",
            100: "#e4c8be",
            200: "#d1a193",
            300: "#be7b68",
            400: "#ab543d",
            500: "#923b24",
            600: "#732f1d",
            700: "#542317",
            800: "#351711",
            900: "#170b0a",
        },
    },

    fontConfig: {
        Poppins: {
            400: {
                normal: "Poppins_400Regular",
            },
            500: {
                normal: "Poppins_500Medium",
            },
            600: {
                normal: "Poppins_600SemiBold",
            },
            700: {
                normal: "Poppins_700Bold",
            },
        },
        BerkshireSwash_400Regular: {
            400: {
                normal: "BerkshireSwash_400Regular",
            },
        },
    },

    fonts: {
        heading: "BerkshireSwash_400Regular",
        body: "Poppins",
        mono: "Poppins",
    },
});
