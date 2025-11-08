import { useToken } from "native-base";

export const useAppColors = () => {
    const colorTokens = [
        "gray.50",
        "white",
        "primary.600",
        "secondary.600",
        "tertiary.600",
        "black.600",
        "gray.200",
        "gray.500",
        "gray.600",
        "gray.100",
        "red.500",
    ];

    const [
        backgroundColor,
        whiteColor,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        blackColor,
        lightGreyColor,
        mediumGreyColor,
        darkGreyColor,
        borderColor,
        invalidColor,
    ] = useToken("colors", colorTokens);

    return {
        backgroundColor,
        whiteColor,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        blackColor,
        lightGreyColor,
        mediumGreyColor,
        darkGreyColor,
        borderColor,
        invalidColor,
    };
};
