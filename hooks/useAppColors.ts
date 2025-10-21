import { useColorModeValue } from "native-base";

export const useAppColors = () => {
    const backgroundColor = useColorModeValue("gray.50", "gray.900");
    const whiteColor = useColorModeValue("white", "gray.800");
    const primaryColor = useColorModeValue("primary.600", "primary.400");
    const secondaryColor = useColorModeValue("secondary.600", "secondary.400");
    const tertiaryColor = useColorModeValue("tertiary.600", "tertiary.400");
    const blackColor = useColorModeValue("black.600", "black.400");
    const lightGreyColor = useColorModeValue("gray.200", "gray.200");
    const mediumGreyColor = useColorModeValue("gray.500", "gray.500");
    const darkGreyColor = useColorModeValue("gray.600", "gray.600");
    const borderColor = useColorModeValue("gray.100", "gray.100");
    const invalidColor = useColorModeValue("red.500", "red.400");

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
